// Note the syntax of these imports from the date-fns library.
// If you import with the syntax: import { format } from "date-fns" the ENTIRE library
// will be included in your production bundle (even if you only use one function).
// This is because react-native does not support tree-shaking.
import { format } from "date-fns/format"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"
import type { Locale } from "date-fns/locale"
import { parseISO } from "date-fns/parseISO"
import i18n from "i18next"

type Options = Parameters<typeof format>[2]

let dateFnsLocale: Locale
export const loadDateFnsLocale = () => {
  const primaryTag = i18n.language.split("-")[0]
  switch (primaryTag) {
    case "en":
      dateFnsLocale = require("date-fns/locale/en-US").default
      break
    case "ar":
      dateFnsLocale = require("date-fns/locale/ar").default
      break
    case "ko":
      dateFnsLocale = require("date-fns/locale/ko").default
      break
    case "es":
      dateFnsLocale = require("date-fns/locale/es").default
      break
    case "fr":
      dateFnsLocale = require("date-fns/locale/fr").default
      break
    case "hi":
      dateFnsLocale = require("date-fns/locale/hi").default
      break
    case "ja":
      dateFnsLocale = require("date-fns/locale/ja").default
      break
    default:
      dateFnsLocale = require("date-fns/locale/en-US").default
      break
  }
}

export const formatDate = (date: string, dateFormat?: string, options?: Options) => {
  const dateOptions = {
    ...options,
    locale: dateFnsLocale,
  }
  return format(parseISO(date), dateFormat ?? "MMM dd, yyyy", dateOptions)
}

export const formatRelativeTime = (date: string) => {
  const distance = formatDistanceToNow(parseISO(date), {
    addSuffix: false,
    locale: dateFnsLocale,
  })

  // Custom formatting to use abbreviated units
  return distance
    .replace(/less than a minute/, "< 1m")
    .replace(/about a minute/, "1m")
    .replace(/(\d+) minutes?/, "$1m")
    .replace(/(\d+) hours?/, "$1hr")
    .replace(/about a day/, "1d")
    .replace(/(\d+) days?/, "$1d")
    .replace(/about a week/, "1w")
    .replace(/(\d+) weeks?/, "$1w")
    .replace(/about a month/, "1mo")
    .replace(/(\d+) months?/, "$1mo")
    .replace(/about a year/, "1y")
    .replace(/(\d+) years?/, "$1y")
}
