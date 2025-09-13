import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { Invoice } from './InvoiceForm';

interface InvoiceListProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onPreview: (invoice: Invoice) => void;
  onNew: () => void;
}

export function InvoiceList({ invoices, onEdit, onDelete, onPreview, onNew }: InvoiceListProps) {
  const getStatusBadge = (invoice: Invoice) => {
    const today = new Date();
    const due = new Date(invoice.dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Check payment status first
    if (invoice.dueAmount <= 0) {
      return <Badge className="bg-green-100 text-green-800 border-green-300">Paid</Badge>;
    }

    if (diffDays < 0) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else if (diffDays <= 7) {
      return <Badge variant="secondary">Due Soon</Badge>;
    } else {
      return <Badge variant="outline">Active</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoice Management</h1>
          <p className="text-gray-600 mt-2">Manage all your invoices in one place</p>
        </div>
        <Button onClick={onNew}>
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">No invoices yet</h3>
              <p className="text-gray-600">Create your first invoice to get started</p>
              <Button onClick={onNew}>
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold">{invoice.invoiceNo}</h3>
                      {getStatusBadge(invoice)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Business:</span>
                        <p>{invoice.billTo.name}</p>
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>
                        <p>{invoice.date}</p>
                      </div>
                      <div>
                        <span className="font-medium">Due:</span>
                        <p>{invoice.dueDate}</p>
                      </div>
                      <div>
                        <span className="font-medium">Total:</span>
                        <p className="font-semibold text-lg text-black">${invoice.total.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Due Amount:</span>
                        <p className={`font-semibold text-lg ${invoice.dueAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ${invoice.dueAmount.toFixed(2)}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min((invoice.paidAmount / invoice.total) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {((invoice.paidAmount / invoice.total) * 100).toFixed(0)}% paid
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPreview(invoice)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(invoice)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(invoice.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {invoices.length > 0 && (
        <div className="text-center py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{invoices.length}</div>
              <div className="text-sm text-blue-600">Total Invoices</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                ${invoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)}
              </div>
              <div className="text-sm text-green-600">Total Value</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">
                ${invoices.reduce((sum, inv) => sum + inv.paidAmount, 0).toFixed(2)}
              </div>
              <div className="text-sm text-orange-600">Total Paid</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">
                ${invoices.reduce((sum, inv) => sum + inv.dueAmount, 0).toFixed(2)}
              </div>
              <div className="text-sm text-red-600">Total Due</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}