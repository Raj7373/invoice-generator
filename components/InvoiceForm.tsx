import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Trash2, Plus, Save, Eye } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/6ad15cbf081fbb183e8f605e9e83b46472c0fc5d.png';

export interface LineItem {
  id: string;
  description: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  date: string;
  dueDate: string;
  billTo: {
    name: string;
    email: string;
    address: string;
  };
  paymentMethod: {
    name: string;
    email: string;
    address: string;
    bankDetails: string;
    contact: string;
  };
  lineItems: LineItem[];
  discount: number;
  sgst: number;
  cgst: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  notes: string;
  paymentInstructions: string;
  paymentLabel: string;
  termsTitle: string;
}

interface InvoiceFormProps {
  invoice?: Invoice;
  onSave: (invoice: Invoice) => void;
  onPreview: () => void;
  isPreview: boolean;
}

export function InvoiceForm({ invoice, onSave, onPreview, isPreview }: InvoiceFormProps) {
  const [formData, setFormData] = useState<Invoice>({
    id: invoice?.id || Date.now().toString(),
    invoiceNo: invoice?.invoiceNo || '#405',
    date: invoice?.date || new Date().toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }),
    dueDate: invoice?.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }),
    billTo: invoice?.billTo || {
      name: '[Business Name]',
      email: '[Business Email]',
      address: '[Business Address]'
    },
    paymentMethod: invoice?.paymentMethod || {
      name: 'YOUR BUSINESS NAME',
      email: '[Your Business Email]',
      address: '[Your Business Address]',
      bankDetails: '[Your Business Phone]',
      contact: '[Your Business Phone]'
    },
    lineItems: invoice?.lineItems || [{
      id: '1',
      description: 'Landing Page',
      price: 500,
      quantity: 1,
      subtotal: 500
    }, {
      id: '2', 
      description: 'Revisions',
      price: 5,
      quantity: 15,
      subtotal: 75
    }],
    discount: invoice?.discount || 0,
    sgst: invoice?.sgst || 0,
    cgst: invoice?.cgst || 0,
    total: invoice?.total || 575,
    paidAmount: invoice?.paidAmount || 0,
    dueAmount: invoice?.dueAmount || 575,
    notes: invoice?.notes || 'This invoice will be expired on (date)',
    paymentInstructions: invoice?.paymentInstructions || 'Payment can be done using the provided link below (email)',
    paymentLabel: invoice?.paymentLabel || 'Pay Online',
    termsTitle: invoice?.termsTitle || 'TERMS AND CONDITIONS'
  });

  const calculateTotals = () => {
    const subtotal = formData.lineItems.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = (subtotal * formData.discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const sgstAmount = (afterDiscount * formData.sgst) / 100;
    const cgstAmount = (afterDiscount * formData.cgst) / 100;
    const total = afterDiscount + sgstAmount + cgstAmount;
    const dueAmount = total - formData.paidAmount;
    
    setFormData(prev => ({ ...prev, total, dueAmount }));
  };

  useEffect(() => {
    calculateTotals();
  }, [formData.lineItems, formData.discount, formData.sgst, formData.cgst, formData.paidAmount]);

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'price' || field === 'quantity') {
            updated.subtotal = updated.price * updated.quantity;
          }
          return updated;
        }
        return item;
      })
    }));
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      price: 0,
      quantity: 1,
      subtotal: 0
    };
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem]
    }));
  };

  const removeLineItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }));
  };

  if (isPreview) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-2xl mx-auto bg-white">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2">INVOICE</h1>
              <p className="text-sm text-gray-600">{formData.paymentMethod.name.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Issue Date</p>
              <p className="font-medium">{formData.date}</p>
            </div>
          </div>

          {/* Horizontal line */}
          <div className="border-t border-gray-900 mb-8"></div>

          {/* Company and Client Info */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-sm font-bold mb-4 tracking-wide">COMPANY INFO</h3>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{formData.paymentMethod.name}</p>
                <p className="text-gray-600">{formData.paymentMethod.address}</p>
                <p className="text-gray-600">{formData.paymentMethod.email}</p>
                <p className="text-gray-600">{formData.paymentMethod.contact}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-4 tracking-wide">CLIENT INFO</h3>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{formData.billTo.name}</p>
                <p className="text-gray-600">{formData.billTo.address}</p>
                <p className="text-gray-600">{formData.billTo.email}</p>
              </div>
            </div>
          </div>

          {/* Horizontal line */}
          <div className="border-t border-gray-900 mb-8"></div>

          {/* Services/Products Table */}
          <div className="mb-12">
            <h3 className="text-sm font-bold mb-6 tracking-wide">SERVICES / PRODUCTS</h3>
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 text-sm font-bold">
                <div className="col-span-5">Name</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-3 text-right">Unit Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              {/* Table Rows */}
              {formData.lineItems.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 text-sm py-2">
                  <div className="col-span-5">{item.description}</div>
                  <div className="col-span-2 text-center">{item.quantity} units</div>
                  <div className="col-span-3 text-right">{item.price.toFixed(2)} USD</div>
                  <div className="col-span-2 text-right">{item.subtotal.toFixed(2)} USD</div>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Due */}
          <div className="mb-12">
            <div className="text-right">
              <h2 className="text-lg font-bold mb-2">Amount Due</h2>
              <p className="text-3xl font-bold">{formData.dueAmount.toFixed(2)} USD</p>
            </div>
          </div>

          {/* Horizontal line */}
          <div className="border-t border-gray-900 mb-8"></div>

          {/* Payment */}
          <div className="mb-12">
            <h3 className="text-sm font-bold mb-4 tracking-wide">PAYMENT</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>{formData.paymentInstructions}</p>
              <div className="mt-4">
                <p className="font-medium">{formData.paymentLabel}</p>
                <p className="text-blue-600">{formData.paymentMethod.email}</p>
              </div>
              {formData.paymentMethod.bankDetails && (
                <div className="mt-4">
                  <p className="font-medium">Bank Details:</p>
                  <p className="text-gray-600">{formData.paymentMethod.bankDetails}</p>
                </div>
              )}
            </div>
          </div>

          {/* Horizontal line */}
          <div className="border-t border-gray-900 mb-8"></div>

          {/* Terms and Conditions */}
          <div className="mb-12">
            <h3 className="text-sm font-bold mb-4 tracking-wide">{formData.termsTitle}</h3>
            <div className="text-sm text-gray-600">
              <p>{formData.notes}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex gap-4 print:hidden">
            <Button onClick={onPreview} variant="outline">
              Back to Edit
            </Button>
            <Button onClick={() => window.print()}>
              Print Invoice
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Invoice Generator</h1>
        <div className="flex gap-2">
          <Button onClick={onPreview} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={() => onSave(formData)}>
            <Save className="w-4 h-4 mr-2" />
            Save Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceNo">Invoice Number</Label>
                <Input
                  id="invoiceNo"
                  value={formData.invoiceNo}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoiceNo: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bill To */}
        <Card>
          <CardHeader>
            <CardTitle>Bill To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.billTo.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  billTo: { ...prev.billTo, name: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.billTo.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  billTo: { ...prev.billTo, email: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="clientAddress">Address</Label>
              <Textarea
                id="clientAddress"
                value={formData.billTo.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  billTo: { ...prev.billTo, address: e.target.value }
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paymentName">Your Name</Label>
              <Input
                id="paymentName"
                value={formData.paymentMethod.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  paymentMethod: { ...prev.paymentMethod, name: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="paymentEmail">Your Email</Label>
              <Input
                id="paymentEmail"
                type="email"
                value={formData.paymentMethod.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  paymentMethod: { ...prev.paymentMethod, email: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="paymentAddress">Address</Label>
              <Textarea
                id="paymentAddress"
                value={formData.paymentMethod.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  paymentMethod: { ...prev.paymentMethod, address: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="bankDetails">Bank Details</Label>
              <Textarea
                id="bankDetails"
                value={formData.paymentMethod.bankDetails}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  paymentMethod: { ...prev.paymentMethod, bankDetails: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={formData.paymentMethod.contact}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  paymentMethod: { ...prev.paymentMethod, contact: e.target.value }
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tax Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Tax & Discount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => setFormData(prev => ({ ...prev, discount: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="sgst">SGST (%)</Label>
              <Input
                id="sgst"
                type="number"
                min="0"
                value={formData.sgst}
                onChange={(e) => setFormData(prev => ({ ...prev, sgst: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="cgst">CGST (%)</Label>
              <Input
                id="cgst"
                type="number"
                min="0"
                value={formData.cgst}
                onChange={(e) => setFormData(prev => ({ ...prev, cgst: Number(e.target.value) }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paidAmount">Paid Amount ($)</Label>
              <Input
                id="paidAmount"
                type="number"
                min="0"
                max={formData.total}
                step="0.01"
                value={formData.paidAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, paidAmount: Number(e.target.value) }))}
              />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Total Amount:</span>
                <span>${formData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span className="font-medium">Paid Amount:</span>
                <span>${formData.paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-red-600 border-t pt-2">
                <span>Due Amount:</span>
                <span>${formData.dueAmount.toFixed(2)}</span>
              </div>
              <div className="mt-2">
                <div className="text-sm text-gray-600 mb-1">Payment Progress</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((formData.paidAmount / formData.total) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {((formData.paidAmount / formData.total) * 100).toFixed(1)}% paid
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Invoice Items</CardTitle>
            <Button onClick={addLineItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.lineItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <Label htmlFor={`desc-${item.id}`}>Description</Label>
                  <Input
                    id={`desc-${item.id}`}
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`price-${item.id}`}>Price ($)</Label>
                  <Input
                    id={`price-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateLineItem(item.id, 'price', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`qty-${item.id}`}>Quantity</Label>
                  <Input
                    id={`qty-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Subtotal</Label>
                  <div className="h-10 flex items-center font-medium">
                    ${item.subtotal.toFixed(2)}
                  </div>
                </div>
                <div className="col-span-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeLineItem(item.id)}
                    disabled={formData.lineItems.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="paymentInstructions">Payment Instructions</Label>
            <Textarea
              id="paymentInstructions"
              value={formData.paymentInstructions}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentInstructions: e.target.value }))}
              placeholder="Payment can be done using the provided link below (email)"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="paymentLabel">Payment Method Label</Label>
            <Input
              id="paymentLabel"
              value={formData.paymentLabel}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentLabel: e.target.value }))}
              placeholder="e.g., Pay Online, Wire Transfer, etc."
            />
          </div>
        </CardContent>
      </Card>

      {/* Terms and Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="termsTitle">Section Title</Label>
            <Input
              id="termsTitle"
              value={formData.termsTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, termsTitle: e.target.value }))}
              placeholder="e.g., TERMS AND CONDITIONS, NOTES, etc."
            />
          </div>
          <div>
            <Label htmlFor="notes">Terms & Conditions</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes, terms, or payment conditions..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Total Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-sm ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${formData.lineItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount ({formData.discount}%):</span>
              <span>-${((formData.lineItems.reduce((sum, item) => sum + item.subtotal, 0) * formData.discount) / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST ({formData.sgst}%):</span>
              <span>${(((formData.lineItems.reduce((sum, item) => sum + item.subtotal, 0) - (formData.lineItems.reduce((sum, item) => sum + item.subtotal, 0) * formData.discount) / 100) * formData.sgst) / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST ({formData.cgst}%):</span>
              <span>${(((formData.lineItems.reduce((sum, item) => sum + item.subtotal, 0) - (formData.lineItems.reduce((sum, item) => sum + item.subtotal, 0) * formData.discount) / 100) * formData.cgst) / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${formData.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600 mt-2">
              <span className="font-medium">Paid:</span>
              <span>${formData.paidAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl text-red-600 border-t pt-2 mt-2">
              <span>Due:</span>
              <span>${formData.dueAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}