const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

export function base64ToUint8Array(base64: string): Uint8Array {
  try {
    const binaryStr = atob(base64)
    const len = binaryStr.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i)
    }
    return bytes
  } catch (error) {
    throw new Error(`Invalid base64 string: ${error}`)
  }
}

export function toBase58(bytes: Uint8Array): string {
  if (!(bytes instanceof Uint8Array)) {
    throw new Error("Expected Uint8Array")
  }

  if (bytes.length === 0) return ""

  const digits = [0]

  for (let i = 0; i < bytes.length; ++i) {
    let carry = bytes[i]
    for (let j = 0; j < digits.length; ++j) {
      const val = digits[j] * 256 + carry
      digits[j] = val % 58
      carry = Math.floor(val / 58)
    }

    while (carry > 0) {
      digits.push(carry % 58)
      carry = Math.floor(carry / 58)
    }
  }

  // Deal with leading zeros
  for (let k = 0; k < bytes.length && bytes[k] === 0; ++k) {
    digits.push(0)
  }

  return digits
    .reverse()
    .map((digit) => BASE58_ALPHABET[digit])
    .join("")
}

export function fromBase58(base58: string): Uint8Array {
  if (typeof base58 !== "string") {
    throw new Error("Expected string")
  }

  if (base58.length === 0) return new Uint8Array(0)

  const digits = base58.split("").map((char) => {
    const index = BASE58_ALPHABET.indexOf(char)
    if (index === -1) {
      throw new Error(`Invalid base58 character: ${char}`)
    }
    return index
  })

  const bytes: number[] = [0]

  for (let i = 0; i < digits.length; ++i) {
    let carry = digits[i]
    for (let j = 0; j < bytes.length; ++j) {
      const val = bytes[j] * 58 + carry
      bytes[j] = val % 256
      carry = Math.floor(val / 256)
    }

    while (carry > 0) {
      bytes.push(carry % 256)
      carry = Math.floor(carry / 256)
    }
  }

  // Deal with leading zeros
  for (let k = 0; k < digits.length && digits[k] === 0; ++k) {
    bytes.push(0)
  }

  return new Uint8Array(bytes.reverse())
}
