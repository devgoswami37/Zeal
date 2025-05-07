"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface ContactSectionProps {
  email: string
  phone: string
  marketingConsent: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ContactSection({ email, phone, marketingConsent, onChange }: ContactSectionProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Contact</h2>
        <div className="text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email or mobile phone number</Label>
          <Input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Email or mobile phone number"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone number</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={onChange}
            placeholder="Phone number"
            required
            className="mt-1"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="marketingConsent"
            name="marketingConsent"
            checked={marketingConsent}
            onCheckedChange={(checked) => {
              onChange({
                target: {
                  name: "marketingConsent",
                  value: "",
                  type: "checkbox",
                  checked: checked as boolean,
                },
              } as React.ChangeEvent<HTMLInputElement>)
            }}
          />
          <Label htmlFor="marketingConsent" className="text-sm text-gray-600">
            Email me with news and offers
          </Label>
        </div>
      </div>
    </div>
  )
}
