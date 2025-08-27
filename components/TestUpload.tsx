'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadProfilePhoto } from '@/services/photoService';
import { useToast } from '@/hooks/use-toast';

const TestUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string>('');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadProfilePhoto(file, 'test-user-123');
      if (result.success) {
        setResult(`Success: ${result.url}`);
        toast({ title: "Upload réussi!", description: result.url });
      } else {
        setResult(`Error: ${result.error}`);
        toast({ title: "Erreur", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      setResult(`Exception: ${error}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Test Upload Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {file && (
            <div>
              <p>Fichier: {file.name}</p>
              <p>Taille: {(file.size / 1024).toFixed(1)} KB</p>
              <p>Type: {file.type}</p>
            </div>
          )}
          <Button 
            onClick={handleUpload} 
            disabled={!file || uploading}
            className="w-full"
          >
            {uploading ? 'Upload...' : 'Upload Test'}
          </Button>
          {result && (
            <div className="p-2 bg-gray-100 rounded text-sm">
              <pre>{result}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestUpload;
