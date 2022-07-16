import { useState, useEffect } from "react"
import { Select } from "grommet"

const DropDown = ({ options, selectedOption, onSelect, multiple }) => {
  const [_options, _setOptions] = useState(options);
  const [searchValue, setSearchValue] = useState("");
  const prefix = "Create"
  useEffect(() => {
    _setOptions(options)
  }, [options])


  const updateCreateOption = (text) => {
    const len = _options.length
    if (_options[len - 1].includes(prefix)) {
      // remove Create option before adding an updated one
      _options.pop()
    }
    _options.push(`${prefix} '${text}'`)
  }

  // improving Search support of special characters
  const getRegExp = (text) => {
    // The line below escapes regular expression special characters:
    // [ \ ^ $ . | ? * + ( )
    const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&")

    // Create the regular expression with modified value which
    // handles escaping special characters. Without escaping special
    // characters, errors will appear in the console
    return new RegExp(escapedText, "i")
  }
  return (
    <Select
      size="small"
      placeholder="Select"
      value={selectedOption}
      options={_options}
      multiple={multiple}
      onChange={({ option }) => {
        if (option.includes(prefix)) {
          
          _options.pop() // remove Create option
          _options.push(searchValue)
          onSelect(searchValue, true)
        } else {
          onSelect(option)
        }
      }}
      onClose={() => _setOptions(options)}
      onSearch={(text) => {
        updateCreateOption(text)
        const exp = getRegExp(text)
        _setOptions(_options.filter((o) => exp.test(o)))
        setSearchValue(text)
      }}
    />
  )
}

export default DropDown
