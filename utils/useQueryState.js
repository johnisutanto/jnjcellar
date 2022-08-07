import { useState, useEffect } from "react"
import { useRouter } from "next/router"

function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    (typeof value !== "number" && value.length === 0)
  )
}

function isRouteParam(route, param) {
  return new RegExp(`\\[${param}\\]`, "g").test(route)
}

export function filterRouteParams(query, route) {
  return Object.entries(query).reduce(
    (obj, [k, v]) =>
      isRouteParam(route, k) ? obj : Object.assign(obj, { [k]: v }),
    {}
  )
}

/**
 * Filters out query entries if their are not present in the state
 *
 * Ex.:
 * query = { foo: 1, bar: "", baz: 2 }
 * state = { foo: 3, bar: 4 }
 * returns = { foo: 1 }
 *
 * @param query
 * @param state
 */
export function filterRelevant(query, state) {
  return Object.keys(state).reduce(
    (obj, key) =>
      isEmpty(query[key]) ? obj : Object.assign(obj, { [key]: query[key] }),
    {}
  )
}

function toQueryString(obj) {
  return new URLSearchParams(obj).toString()
}

/**
 * Filters out entries if key or value are empty
 *
 * Ex.:
 * obj = { foo: 0, bar: "", baz: [], "": "foo" }
 * returns = { foo: 0 }
 *
 * @param obj
 */
function clearEmptyValues(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => !isEmpty(k) && !isEmpty(v))
  )
}

export function toCleanQueryString(obj) {
  return new URLSearchParams(clearEmptyValues(obj)).toString()
}

function isUpToDate(query, state, route) {
  return (
    toQueryString(
      clearEmptyValues(filterRouteParams(filterRelevant(query, state), route))
    ) === toQueryString(clearEmptyValues(state))
  )
}

export default function useQueryState(defaultState) {
  const { query, push, route, asPath } = useRouter()

  const [state, setState] = useState(
    Object.assign(
      {},
      defaultState,
      filterRouteParams(filterRelevant(query, defaultState), route)
    )
  )

  useEffect(() => {
    if (isUpToDate(query, state, route)) return

    // Update query string
    push(
      {
        pathname: new URL(asPath, "http://localhost/").pathname,
        query: clearEmptyValues({ ...filterRouteParams(query, route), ...state }),
      },
      undefined,
      {
        shallow: true,
      }
    )
  }, [query, push, state, asPath, route])

  return [state, setState]
}
