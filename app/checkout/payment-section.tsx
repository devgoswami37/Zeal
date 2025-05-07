export function PaymentSection() {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Payment</h2>
      <p className="text-sm text-gray-600 mb-4">All transactions are secure and encrypted.</p>

      <div className="border rounded-lg overflow-hidden">
        <div className="p-4 bg-blue-50 border-b">
          <div className="flex items-center">
            <input
              type="radio"
              id="razorpay"
              name="paymentMethod"
              value="razorpay"
              checked
              readOnly
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="razorpay" className="ml-3 block text-sm font-medium text-gray-700">
              <div className="flex items-center">
                <span className="mr-2">Razorpay Payment Gateway (UPI, Cards & NetBanking)</span>
                <div className="flex space-x-1">
                  <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">UPI</span>
                  </div>
                  <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-700">VISA</span>
                  </div>
                  <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-red-500">MC</span>
                  </div>
                  <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs">+4</span>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
        <div className="p-4 bg-gray-50">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 border rounded flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600">
            After clicking "Pay now", you will be redirected to Razorpay Payment Gateway (UPI, Cards & NetBanking) to
            complete your purchase securely.
          </p>
        </div>
      </div>
    </div>
  )
}
