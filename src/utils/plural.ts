/**
 * Returns the sinuglar vs plural form of the word.
 * @param value         the number
 * @param singularForm  the singular form of this word
 * @param pluralForm    optionally the plural form of this word, else default to appending an "s"
 * @returns             the singular or plural form, depending on the value
 */
export default function plural(
  value: number,
  singularForm: string,
  pluralForm?: string,
) {
  if(value === 1) { //if this is singular
    return singularForm //return the singular form
  }
  else if(pluralForm !== undefined) { //if there is a custom plural form
    return pluralForm //return the plural form
  }
  return singularForm + "s" //else return the singular form with an appended "s"
}