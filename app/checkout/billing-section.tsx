"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { INDIAN_STATES } from "@/lib/constants"

interface BillingSectionProps {
  formData: {
    billingAddressSameAsShipping: boolean
    billingAddress: {
      firstName: string
      lastName: string
      address: string
      apartment: string
      city: string
      state: string
      pinCode: string
      country: string
    }
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export function BillingSection({ formData, onChange }: BillingSectionProps) {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Billing address</h2>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="radio"
            id="sameAsShipping"
            name="billingAddressSameAsShipping"
            checked={formData.billingAddressSameAsShipping}
            onChange={() => {
              onChange({
                target: {
                  name: "billingAddressSameAsShipping",
                  value: true, // Set value to a boolean true
                  type: "radio",
                  checked: true,
                },
              } as React.ChangeEvent<HTMLInputElement>)
            }}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label htmlFor="sameAsShipping" className="ml-3 block text-sm font-medium text-gray-700">
            Same as shipping address
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="radio"
            id="differentBilling"
            name="billingAddressSameAsShipping"
            checked={!formData.billingAddressSameAsShipping}
            onChange={() => {
              onChange({
                target: {
                  name: "billingAddressSameAsShipping",
                  value: false, // Set value to a boolean false
                  type: "radio",
                  checked: false,
                },
              } as React.ChangeEvent<HTMLInputElement>)
            }}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label htmlFor="differentBilling" className="ml-3 block text-sm font-medium text-gray-700">
            Use a different billing address
          </label>
        </div>

        {!formData.billingAddressSameAsShipping && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div>
              <Label htmlFor="billingAddress.country">Country/Region</Label>
              <Select
                value={formData.billingAddress.country}
                onValueChange={(value) => {
                  onChange({
                    target: {
                      name: "billingAddress.country",
                      value,
                    },
                  } as React.ChangeEvent<HTMLSelectElement>)
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billingAddress.firstName">First name</Label>
                <Input
                  type="text"
                  id="billingAddress.firstName"
                  name="billingAddress.firstName"
                  value={formData.billingAddress.firstName}
                  onChange={onChange}
                  placeholder="First name"
                  required={!formData.billingAddressSameAsShipping}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="billingAddress.lastName">Last name</Label>
                <Input
                  type="text"
                  id="billingAddress.lastName"
                  name="billingAddress.lastName"
                  value={formData.billingAddress.lastName}
                  onChange={onChange}
                  placeholder="Last name"
                  required={!formData.billingAddressSameAsShipping}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="billingAddress.address">Address</Label>
              <Input
                type="text"
                id="billingAddress.address"
                name="billingAddress.address"
                value={formData.billingAddress.address}
                onChange={onChange}
                placeholder="Address"
                required={!formData.billingAddressSameAsShipping}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="billingAddress.apartment">Apartment, suite, etc. (optional)</Label>
              <Input
                type="text"
                id="billingAddress.apartment"
                name="billingAddress.apartment"
                value={formData.billingAddress.apartment}
                onChange={onChange}
                placeholder="Apartment, suite, etc."
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billingAddress.city">City</Label>
                <Input
                  type="text"
                  id="billingAddress.city"
                  name="billingAddress.city"
                  value={formData.billingAddress.city}
                  onChange={onChange}
                  placeholder="City"
                  required={!formData.billingAddressSameAsShipping}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="billingAddress.state">State</Label>
                <Select
                  value={formData.billingAddress.state}
                  onValueChange={(value) => {
                    onChange({
                      target: {
                        name: "billingAddress.state",
                        value,
                      },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="billingAddress.pinCode">PIN code</Label>
              <Input
                type="text"
                id="billingAddress.pinCode"
                name="billingAddress.pinCode"
                value={formData.billingAddress.pinCode}
                onChange={onChange}
                placeholder="PIN code"
                required={!formData.billingAddressSameAsShipping}
                maxLength={6}
                pattern="[0-9]{6}"
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
