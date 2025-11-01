'use client';

import { Button } from '@/components/ui/button';

export default function AProposButtons() {
  return (
    <div className="flex justify-center space-x-4 mb-12">
      <Button
        variant="outline"
        className="
          border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white
          transition-all duration-200 hover:scale-105 hover:shadow-md
          px-6 py-2 rounded-full
        "
        onClick={() => window.open('https://facebook.com/chanthanathaikok', '_blank')}
      >
        Facebook
      </Button>
      <Button
        variant="outline"
        className="
          border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white
          transition-all duration-200 hover:scale-105 hover:shadow-md
          px-6 py-2 rounded-full
        "
        onClick={() => window.open('https://instagram.com/chanthanathaikok', '_blank')}
      >
        Instagram
      </Button>
    </div>
  );
}
