import { useEffect, useState } from 'react'
import styles from './css/select.module.css'

type SelectOption = {
  label: string
  value: string | number
}

type SelectProps = {
  options: SelectOption[]
  onChange: (value: SelectOption | undefined) => void
  value?: SelectOption
}

export function Select({value, onChange, options}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [higlightedIndex, setHiglightedIndex] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setHiglightedIndex(0)
    }
  }, [isOpen])

  function clearOptions() {
    onChange(undefined)
  }

  function selectOption(option: SelectOption) {
    if (option != value ) onChange(option)
  }

  function isOptionSelected(option: SelectOption) {
    return option === value
  }

  return(
    <div onBlur={() => setIsOpen(false)} onClick={() => setIsOpen(val => !val)} className={styles.container} tabIndex={0}>
      <span className={styles.value}>{value?.label}</span>
      <button className={styles['clear-btn']} onClick={(e) => {
        e.stopPropagation()
        clearOptions()
      }}>&times;</button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
        {options.map((option, index) => {
          return (
            <li
              key={option.value}
              className={`${styles.option} ${ isOptionSelected(option) ? styles.selected : ''} ${ (higlightedIndex == index) ? styles.highlighted : ''} `}
              onClick={(e) => {
                e.stopPropagation()
                selectOption(option)
                setIsOpen(false)
              }}
              onMouseEnter={() => {
                setHiglightedIndex(index)
              }}
              >
              {option.label}
            </li>
            )
        })}
      </ul>
    </div>
  )
}