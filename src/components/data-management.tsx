'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { storage } from '@/lib/storage';

export function DataManagement() {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isClearOpen, setIsClearOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  const handleExport = () => {
    const data = storage.exportData();
    if (!data) {
      alert('No data to export');
      return;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chronicle-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsExportOpen(false);
  };

  const handleImport = () => {
    if (!importData.trim()) {
      setImportStatus('error');
      setImportMessage('Please paste your backup data');
      return;
    }

    const success = storage.importData(importData);
    if (success) {
      setImportStatus('success');
      setImportMessage('Data imported successfully! Please refresh the page to see your data.');
      setImportData('');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      setImportStatus('error');
      setImportMessage('Failed to import data. Please check the format and try again.');
    }
  };

  const handleClearAll = () => {
    storage.clear();
    setIsClearOpen(false);
    alert('All data cleared! The page will refresh.');
    window.location.reload();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-2">
      {/* Export Dialog */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Your Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will download all your achievements, resources, goals, tasks, and routines as a JSON file.
              You can use this file to backup your data or import it later.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleExport} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Backup
              </Button>
              <Button variant="outline" onClick={() => setIsExportOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Your Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Import data from a Chronicle backup file. This will add to your existing data.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="file-import">Upload Backup File</Label>
              <input
                id="file-import"
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="import-data">Or Paste Backup Data</Label>
              <Textarea
                id="import-data"
                value={importData}
                onChange={(e) => {
                  setImportData(e.target.value);
                  setImportStatus('idle');
                }}
                placeholder="Paste your Chronicle backup JSON data here..."
                rows={8}
                className="font-mono text-xs"
              />
            </div>

            {importStatus !== 'idle' && (
              <Alert variant={importStatus === 'error' ? 'destructive' : 'default'}>
                <AlertDescription>{importMessage}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleImport} 
                className="flex-1"
                disabled={!importData.trim() || importStatus === 'success'}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
              <Button variant="outline" onClick={() => {
                setIsImportOpen(false);
                setImportData('');
                setImportStatus('idle');
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clear All Dialog */}
      <Dialog open={isClearOpen} onOpenChange={setIsClearOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Clear All Data
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This will permanently delete all your achievements, resources, goals, tasks, and routines.
                This action cannot be undone!
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              Make sure you have exported your data first if you want to keep a backup.
            </p>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleClearAll} className="flex-1">
                Yes, Clear All Data
              </Button>
              <Button variant="outline" onClick={() => setIsClearOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}