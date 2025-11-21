'use client';

import { Button } from '@/components/ui/button';

export default function AProposButtons() {
  return (
    <div className="flex justify-center space-x-4 mb-12">
      <Button
        variant="outline"
        size="sm"
        className="
          bg-white/90 backdrop-blur-sm hover:bg-white
          border-thai-orange/20 hover:border-thai-orange/40
          text-thai-green hover:text-thai-green
          transition-all duration-200
          shadow-md hover:shadow-lg
          rounded-full px-4 py-2
        "
        onClick={() => window.open('https://facebook.com/chanthanathaikok', '_blank')}
      >
        Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="
          bg-white/90 backdrop-blur-sm hover:bg-white
          border-thai-orange/20 hover:border-thai-orange/40
          text-thai-green hover:text-thai-green
          transition-all duration-200
          shadow-md hover:shadow-lg
          rounded-full px-4 py-2
        "
        onClick={() => window.open('https://instagram.com/chanthanathaikok', '_blank')}
      >
        Instagram
      </Button>
    </div>
  );
}
