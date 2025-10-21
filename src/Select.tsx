import { useEffect, useRef, useState } from 'react'
import styles from './css/select.module.css'

export type SelectOption = {
  label: string
  value: string | number
}

type MultipleSelectProps = {
  multiple: true
  value: SelectOption[]
  onChange: (value: SelectOption[]) => void
}

type SingleSelectProps = {
  multiple?: false
  value?: SelectOption
  onChange: (value: SelectOption | undefined) => void
}

type SelectProps = {
  options: SelectOption[]
} & ( SingleSelectProps | MultipleSelectProps )

export function Select({multiple, value, onChange, options}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [higlightedIndex, setHiglightedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setHiglightedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return

      switch (e.code) {
        case 'Enter':
        case 'Space':
          setIsOpen( prev => !prev)
          if(isOpen) selectOption(options[higlightedIndex])
          break;

        case 'ArrowUp':
        case 'ArrowDown':
          if (!isOpen) {
            setIsOpen(true)
          }

          const newVal = higlightedIndex + (e.code == 'ArrowDown' ? 1 : -1 )
          if (newVal >= 0 && newVal < options.length) {
            setHiglightedIndex(newVal)
          }
        break;
      }
    }

    const container = containerRef.current
    if (!container) return

    container.addEventListener('keydown', handler)

    return () => {
      container.removeEventListener('keydown', handler)
    }
  }, [isOpen, higlightedIndex])

  function clearOptions() {
    if (multiple) {
      onChange([])
    } else {
      onChange(undefined)
    }
  }

  function selectOption(option: SelectOption) {

    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter( o => o != option ))
      } else {
        onChange([...value, option])
      }
    } else {
      if (option != value ) onChange(option)
    }
  }

  function isOptionSelected(option: SelectOption) {
    return multiple ? value.includes(option) : option === value
  }

  return(
    <div
    ref={containerRef}
    onBlur={() => setIsOpen(false)}
    onClick={() => setIsOpen(val => !val)}
    className={styles.container} tabIndex={0}>
      <span className={styles.value}>
        {multiple
        ? value.map(
          (v) => {
            return (
              <button
                key={v.value}
                onClick={(e) => {
                  e.stopPropagation()
                  selectOption(v)
                }}
                className={styles['option-badge']}
              >
                {v.label}
                <span className={styles['remove-btn']}>&times;</span>
              </button>
            )
          }
        ) : value?.label}
      </span>
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