# Pattern: Polaroid Dialog

**Créé le :** 2025-11-11
**Utilisé dans :** `components/NavigationCards.tsx` (Dialog PWA Installation)

## 📸 Description

Dialog modal avec effet photo Polaroid : légère rotation (-2deg) qui se redresse au survol, bordure colorée, image en haut format 16:9, contenu en bas.

## ✨ Caractéristiques

- **Effet Polaroid** : Rotation -2deg + hover:rotate-0 (photo posée qui se redresse)
- **Fermeture multiple** : X, Escape, clic extérieur, bouton Annuler
- **Accessible** : DialogTitle et DialogDescription pour lecteurs d'écran
- **Layout card-like** : Image aspect-video en haut + contenu p-6 en bas
- **Animations fluides** : Transitions 200-300ms

## 🎨 Structure Visuelle

```
┌─────────────────────────────────┐
│  [X]                    [Icon]  │ ← Image aspect-video
│         IMAGE HERE              │
│                                 │
├─────────────────────────────────┤
│                                 │
│           TITRE                 │ ← DialogTitle
│         Description             │ ← DialogDescription
│                                 │
│  [Bouton 1]  [Bouton 2]        │ ← Actions
│                                 │
└─────────────────────────────────┘
```

## 💻 Code Template

### Imports
```tsx
import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { IconName } from 'lucide-react'
```

### État
```tsx
const [showDialog, setShowDialog] = useState(false)
```

### JSX Structure
```tsx
<Dialog open={showDialog} onOpenChange={setShowDialog}>
  <DialogContent className="max-w-md bg-white border-2 border-thai-orange shadow-2xl p-0 rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
    {/* Bouton de fermeture X */}
    <button
      onClick={() => setShowDialog(false)}
      className="absolute right-4 top-4 z-20 rounded-full p-1.5 text-white/80 hover:text-white hover:bg-black/20 transition-all duration-200"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    {/* Image en haut (aspect-video = 16:9) */}
    <div className="relative w-full aspect-video overflow-hidden">
      <Image
        src="/path/to/image.svg"
        alt="Description"
        fill
        className="object-cover"
      />
      {/* Icon overlay (optionnel) */}
      <IconName className="absolute top-4 left-4 h-8 w-8 text-white" />
    </div>

    {/* Contenu */}
    <div className="p-6 space-y-4">
      <div className="space-y-3">
        <DialogTitle className="text-2xl font-bold text-thai-green">
          Titre du Dialog
        </DialogTitle>
        <DialogDescription className="text-thai-green/90 text-base leading-relaxed text-center">
          Description ou message à afficher.
        </DialogDescription>
      </div>

      {/* Actions (2 boutons) */}
      <div className="flex gap-3">
        <Button
          onClick={() => setShowDialog(false)}
          variant="outline"
          className="flex-1 rounded-lg border-2 border-thai-green text-thai-green hover:bg-thai-green hover:text-white transition-all duration-200"
        >
          Annuler
        </Button>
        <Button
          onClick={() => {
            // Action principale
            setShowDialog(false)
          }}
          className="flex-1 bg-thai-orange hover:bg-thai-orange/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Confirmer
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
```

## 🎯 Classes Tailwind Clés

### DialogContent
```tsx
className="max-w-md bg-white border-2 border-thai-orange shadow-2xl p-0 rotate-[-2deg] hover:rotate-0 transition-transform duration-300"
```

**Explications :**
- `max-w-md` : Largeur maximale (28rem = 448px)
- `bg-white` : Fond blanc
- `border-2 border-thai-orange` : Bordure orange 2px
- `shadow-2xl` : Ombre portée importante
- `p-0` : Pas de padding (géré dans sections internes)
- `rotate-[-2deg]` : Rotation -2 degrés (effet Polaroid)
- `hover:rotate-0` : Rotation à 0 au survol (redressement)
- `transition-transform duration-300` : Animation fluide 300ms

### Image Container
```tsx
className="relative w-full aspect-video overflow-hidden"
```

**Explications :**
- `relative` : Positionnement pour Next.js Image fill
- `w-full` : Largeur 100%
- `aspect-video` : Ratio 16:9
- `overflow-hidden` : Masque débordement image

### Bouton Fermeture (X)
```tsx
className="absolute right-4 top-4 z-20 rounded-full p-1.5 text-white/80 hover:text-white hover:bg-black/20 transition-all duration-200"
```

### Bouton Annuler (Vert)
```tsx
className="flex-1 rounded-lg border-2 border-thai-green text-thai-green hover:bg-thai-green hover:text-white transition-all duration-200"
```

### Bouton Confirmer (Orange)
```tsx
className="flex-1 bg-thai-orange hover:bg-thai-orange/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
```

## 🎨 Variantes de Couleurs

### Bordure Dialog
```tsx
border-thai-orange   // Orange (défaut)
border-thai-green    // Vert
border-blue-500      // Bleu
border-red-500       // Rouge
```

### Titre
```tsx
text-thai-green      // Vert (défaut)
text-thai-orange     // Orange
text-gray-900        // Noir
```

### Description
```tsx
text-thai-green/90   // Vert 90% opacité (défaut)
text-gray-600        // Gris
```

## 📐 Variantes de Taille

### Petite (Mobile)
```tsx
className="max-w-sm ..."  // 24rem = 384px
```

### Moyenne (Défaut)
```tsx
className="max-w-md ..."  // 28rem = 448px
```

### Grande
```tsx
className="max-w-lg ..."  // 32rem = 512px
```

### Extra Large
```tsx
className="max-w-xl ..."  // 36rem = 576px
```

## 🔄 Variantes d'Animation

### Sans Rotation (Dialog Normal)
```tsx
className="max-w-md bg-white border-2 border-thai-orange shadow-2xl p-0"
// Supprimer: rotate-[-2deg] hover:rotate-0 transition-transform duration-300
```

### Rotation Plus Prononcée
```tsx
className="... rotate-[-5deg] hover:rotate-0 ..."
```

### Rotation Positive
```tsx
className="... rotate-[2deg] hover:rotate-0 ..."
```

## ♿ Accessibilité

### Obligatoire
- ✅ `DialogTitle` : Titre accessible (ARIA)
- ✅ `DialogDescription` : Description accessible (ARIA)
- ✅ Bouton X avec `aria-label` (recommandé)

### Exemple avec aria-label
```tsx
<button
  onClick={() => setShowDialog(false)}
  aria-label="Fermer le dialog"
  className="..."
>
  <svg>...</svg>
</button>
```

## 🎯 Use Cases

### Confirmation d'Action
- Installation PWA ✅ (implémenté)
- Suppression de compte
- Validation commande
- Confirmation paiement

### Information avec Image
- Nouveauté produit
- Promotion spéciale
- Tutoriel rapide
- Annonce importante

### Formulaire Court
- Saisie code promo
- Choix option livraison
- Notation rapide
- Feedback utilisateur

## ⚠️ Points d'Attention

### Dialog vs AlertDialog
- **Dialog** : Ferme au clic extérieur ✅
- **AlertDialog** : Nécessite action explicite (Annuler/Confirmer)

**Utilisez Dialog pour :**
- Actions non critiques
- Informations
- Formulaires simples

**Utilisez AlertDialog pour :**
- Actions irréversibles (suppression)
- Confirmations critiques (paiement)

### Image Aspect Ratio
- `aspect-video` = 16:9 (recommandé) ✅
- `aspect-square` = 1:1
- `aspect-[4/3]` = 4:3

### Performance
- Utilisez Next.js `Image` component (optimisation automatique)
- `loading="lazy"` si plusieurs dialogs
- `priority={false}` pour dialogs non critiques

## 📱 Responsive

Le pattern est responsive par défaut :
- **Mobile** : max-w-md = 90vw sur petits écrans
- **Tablet** : max-w-md = 448px
- **Desktop** : max-w-md = 448px

### Ajustements Mobile (optionnel)
```tsx
className="max-w-[95vw] sm:max-w-md ..."
```

## 🔗 Fichiers Liés

- **Implementation** : `components/NavigationCards.tsx` (lignes 283-337)
- **Types** : `@/components/ui/dialog` (shadcn/ui)
- **Hooks** : `useState` (React)

## 📚 Références

- [Radix UI Dialog](https://www.radix-ui.com/docs/primitives/components/dialog)
- [shadcn/ui Dialog](https://ui.shadcn.com/docs/components/dialog)
- [Tailwind CSS Transforms](https://tailwindcss.com/docs/transform)
- [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image)

---

**💡 Conseil :** Ce pattern fonctionne bien pour des actions nécessitant une confirmation visuelle attrayante tout en restant accessible et performant.
