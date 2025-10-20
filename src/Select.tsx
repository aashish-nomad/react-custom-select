import { useState } from 'react'
import styles from './css/select.module.css'

type SelectOption = {
  label: string
  value: any
}

type SelectProps = {
  options: SelectOption[]
  onChange: (value: SelectOption | undefined) => void
  value?: SelectOption
}

export function Select({value, onChange, options}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  function clearOptions() {
    onChange(undefined)
  }

  function selectOption(option: SelectOption) {
    onChange(option)
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
        {options.map(option => {
          return <li key={option.value} className={styles.option} onClick={(e) => {
            e.stopPropagation()
            selectOption(option)
            setIsOpen(false)
          }}>{option.label}</li>
        })}
      </ul>
    </div>
  )
}