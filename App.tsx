import React, { useState, useEffect } from 'react';
import { InvoiceForm, Invoice } from './components/InvoiceForm';
import { InvoiceList } from './components/InvoiceList';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

type AppView = 'list' | 'form' | 'preview';

export default function App() {
  const [view, setView] = useState<AppView>('list');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | undefined>();
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | undefined>();

  // Load invoices from localStorage on mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      try {
        setInvoices(JSON.parse(savedInvoices));
      } catch (error) {
        console.error('Error loading invoices:', error);
      }
    }
  }, []);

  // Save invoices to localStorage whenever invoices change
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const handleSaveInvoice = (invoice: Invoice) => {
    setInvoices(prev => {
      const existingIndex = prev.findIndex(inv => inv.id === invoice.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = invoice;
        toast.success('Invoice updated successfully!');
        return updated;
      } else {
        toast.success('Invoice created successfully!');
        return [...prev, invoice];
      }
    });
    setView('list');
    setCurrentInvoice(undefined);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setView('form');
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
    toast.success('Invoice deleted successfully!');
  };

  const handlePreviewInvoice = (invoice: Invoice) => {
    setPreviewInvoice(invoice);
    setView('preview');
  };

  const handleNewInvoice = () => {
    setCurrentInvoice(undefined);
    setView('form');
  };

  const handlePreviewFromForm = () => {
    setView('preview');
  };

  const handleBackToList = () => {
    setView('list');
    setCurrentInvoice(undefined);
    setPreviewInvoice(undefined);
  };

  const handleBackToForm = () => {
    setView('form');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {view === 'list' && (
        <InvoiceList
          invoices={invoices}
          onEdit={handleEditInvoice}
          onDelete={handleDeleteInvoice}
          onPreview={handlePreviewInvoice}
          onNew={handleNewInvoice}
        />
      )}

      {view === 'form' && (
        <div className="bg-white min-h-screen">
          <div className="border-b bg-white sticky top-0 z-10">
            <div className="max-w-6xl mx-auto p-4">
              <button
                onClick={handleBackToList}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Invoices
              </button>
            </div>
          </div>
          <InvoiceForm
            invoice={currentInvoice}
            onSave={handleSaveInvoice}
            onPreview={handlePreviewFromForm}
            isPreview={false}
          />
        </div>
      )}

      {view === 'preview' && (
        <InvoiceForm
          invoice={previewInvoice || currentInvoice}
          onSave={handleSaveInvoice}
          onPreview={currentInvoice ? handleBackToForm : handleBackToList}
          isPreview={true}
        />
      )}
    </div>
  );
}