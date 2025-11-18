"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SpiceDistributionSelector } from '@/components/commander/SpiceDistributionSelector';

interface SpiceDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  platName: string;
  totalQuantity: number;
  currentDistribution: number[];
  onSave: (newDistribution: number[]) => void;
}

export function SpiceDistributionModal({
  isOpen,
  onClose,
  platName,
  totalQuantity,
  currentDistribution,
  onSave,
}: SpiceDistributionModalProps) {
  const [distribution, setDistribution] = useState<number[]>(currentDistribution);

  const handleSave = () => {
    onSave(distribution);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-transparent border-0 shadow-none">
        <DialogTitle className="sr-only">
          Modifier la distribution épicée
        </DialogTitle>
        <div className="py-6">
          <SpiceDistributionSelector
            totalQuantity={totalQuantity}
            distribution={distribution}
            onDistributionChange={setDistribution}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
