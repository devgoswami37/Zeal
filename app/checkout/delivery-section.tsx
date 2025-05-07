"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { INDIAN_STATES } from "@/lib/constants"

interface DeliverySectionProps {
  formData: {
    firstName: string
    lastName: string
    address: string
    apartment: string
    city: string
    state: string
    pinCode: string
    country: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export function DeliverySection({ formData, onChange }: DeliverySectionProps) {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Delivery</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="country">Country/Region</Label>
          <Select
            value={formData.country}
            onValueChange={(value) => {
              onChange({
                target: {
                  name: "country",
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
            <Label htmlFor="firstName">First name (optional)</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={onChange}
              placeholder="First name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="lastName">Last name</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={onChange}
              placeholder="Last name"
              required
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={onChange}
            placeholder="Address"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
          <Input
            type="text"
            id="apartment"
            name="apartment"
            value={formData.apartment}
            onChange={onChange}
            placeholder="Apartment, suite, etc."
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={onChange}
              placeholder="City"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Select
              value={formData.state}
              onValueChange={(value) => {
                onChange({
                  target: {
                    name: "state",
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
          <Label htmlFor="pinCode">PIN code</Label>
          <Input
            type="text"
            id="pinCode"
            name="pinCode"
            value={formData.pinCode}
            onChange={onChange}
            placeholder="PIN code"
            required
            maxLength={6}
            pattern="[0-9]{6}"
            className="mt-1"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="saveInformation"
            name="saveInformation"
            checked={formData.saveInformation}
            onChange={onChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <Label htmlFor="saveInformation" className="text-sm text-gray-600">
            Save this information for next time
          </Label>
        </div>
      </div>
    </div>
  )
}
