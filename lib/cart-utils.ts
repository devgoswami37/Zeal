/**
 * Checks if the saved cart in localStorage has expired
 * @returns true if cart is valid, false if expired or not found
 */
export function isCartValid(): boolean {
    try {
      const savedCart = localStorage.getItem("cart")
      if (!savedCart) return false
  
      const parsedCart = JSON.parse(savedCart)
      const expiryDate = parsedCart.expiryDate
  
      if (expiryDate && new Date(expiryDate) > new Date()) {
        return true
      }
  
      return false
    } catch (error) {
      console.error("Error checking cart validity:", error)
      return false
    }
  }
  
  /**
   * Clears expired cart data from localStorage
   */
  export function cleanupExpiredCart(): void {
    try {
      const savedCart = localStorage.getItem("cart")
      if (!savedCart) return
  
      const parsedCart = JSON.parse(savedCart)
      const expiryDate = parsedCart.expiryDate
  
      if (!expiryDate || new Date(expiryDate) <= new Date()) {
        localStorage.removeItem("cart")
      }
    } catch (error) {
      console.error("Error cleaning up expired cart:", error)
    }
  }
  
  /**
   * Updates the expiry date of the cart to extend its lifetime
   * @param days Number of days to extend the cart (default: 30)
   */
  export function extendCartExpiry(days = 30): void {
    try {
      const savedCart = localStorage.getItem("cart")
      if (!savedCart) return
  
      const parsedCart = JSON.parse(savedCart)
  
      // Set new expiry date
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + days)
  
      localStorage.setItem(
        "cart",
        JSON.stringify({
          data: parsedCart.data,
          expiryDate: expiryDate.toISOString(),
        }),
      )
    } catch (error) {
      console.error("Error extending cart expiry:", error)
    }
  }
  