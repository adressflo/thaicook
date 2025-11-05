import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPlats, createPlat, updatePlat, deletePlat } from '@/app/actions/plats';
import type { PlatUI } from '@/types/app';

// Import mocked prisma from setup
import { prisma } from '@/lib/prisma';

// Mock revalidatePath from Next.js
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Plats Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPlats', () => {
    it('should return all active plats', async () => {
      const mockPlats = [
        {
          idplats: 1,
          plat: 'Pad Thai',
          categorie: 'Plats principaux',
          description: 'Nouilles sautées traditionnelles',
          prix: 12.5,
          est_epuise: false,
          epuise_depuis: null,
          epuise_jusqu_a: null,
          image_url: null,
        },
        {
          idplats: 2,
          plat: 'Tom Yum',
          categorie: 'Soupes',
          description: 'Soupe épicée',
          prix: 8.0,
          est_epuise: false,
          epuise_depuis: null,
          epuise_jusqu_a: null,
          image_url: null,
        },
      ];

      (prisma.plats_db.findMany as any).mockResolvedValue(mockPlats);

      const result = await getPlats();

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: 1,
        plat: 'Pad Thai',
        prix: '12.5',
      });
      expect(prisma.plats_db.findMany).toHaveBeenCalledWith({
        where: { est_epuise: false },
        orderBy: { plat: 'asc' },
      });
    });

    it('should handle prix as string and null dates', async () => {
      const mockPlat = {
        idplats: 1,
        plat: 'Test',
        categorie: 'Test',
        description: 'Test',
        prix: 10.99,
        est_epuise: false,
        epuise_depuis: null,
        epuise_jusqu_a: null,
        image_url: null,
      };

      (prisma.plats_db.findMany as any).mockResolvedValue([mockPlat]);

      const result = await getPlats();

      expect(result[0].prix).toBe('10.99');
      expect(result[0].epuise_depuis).toBeNull();
      expect(result[0].epuise_jusqu_a).toBeNull();
    });

    it('should throw error on database failure', async () => {
      (prisma.plats_db.findMany as any).mockRejectedValue(new Error('DB Error'));

      await expect(getPlats()).rejects.toThrow('Impossible de récupérer les plats');
    });
  });

  describe('createPlat', () => {
    it('should create a new plat with valid data', async () => {
      const newPlatData = {
        plat: 'Green Curry',
        description: 'Curry vert épicé',
        prix: '13.50',
      };

      const mockCreatedPlat = {
        idplats: 3,
        plat: 'Green Curry',
        categorie: 'Plats principaux',
        description: 'Curry vert épicé',
        prix: '13.50',
        est_epuise: false,
        epuise_depuis: null,
        epuise_jusqu_a: null,
        image_url: null,
      };

      (prisma.plats_db.create as any).mockResolvedValue(mockCreatedPlat);

      const result = await createPlat(newPlatData);

      expect(result.data).toMatchObject({
        id: 3,
        plat: 'Green Curry',
        prix: '13.50',
      });
      expect(prisma.plats_db.create).toHaveBeenCalledWith({
        data: {
          ...newPlatData,
          est_epuise: false,
        },
      });
    });

    it('should reject invalid plat data (validation)', async () => {
      const invalidData = {
        plat: '', // Empty plat name (should fail Zod validation)
        prix: '-5', // Negative prix (should fail Zod validation)
      };

      const result = await createPlat(invalidData as any);

      expect(result.validationErrors).toBeDefined();
    });

    it('should throw error on database failure', async () => {
      (prisma.plats_db.create as any).mockRejectedValue(new Error('DB Error'));

      const result = await createPlat({
        plat: 'Test',
        description: 'Test',
        prix: '10.00',
      });

      expect(result.serverError).toBeDefined();
    });
  });

  describe('updatePlat', () => {
    it('should update existing plat', async () => {
      const updateData = {
        id: 1,
        plat: 'Pad Thai Updated',
        prix: '14.00',
      };

      const mockUpdatedPlat = {
        idplats: 1,
        plat: 'Pad Thai Updated',
        categorie: 'Plats principaux',
        description: 'Updated description',
        prix: 14.0,
        est_epuise: false,
        epuise_depuis: null,
        epuise_jusqu_a: null,
        image_url: null,
      };

      (prisma.plats_db.update as any).mockResolvedValue(mockUpdatedPlat);

      const result = await updatePlat(updateData);

      expect(result.data).toMatchObject({
        id: 1,
        plat: 'Pad Thai Updated',
        prix: '14',
      });
      expect(prisma.plats_db.update).toHaveBeenCalledWith({
        where: { idplats: 1 },
        data: { plat: 'Pad Thai Updated', prix: '14.00' },
      });
    });

    it('should reject invalid update data', async () => {
      const invalidData = {
        id: -1, // Invalid ID
        plat: '',
      };

      const result = await updatePlat(invalidData as any);

      expect(result.validationErrors).toBeDefined();
    });

    it('should throw error on database failure', async () => {
      (prisma.plats_db.update as any).mockRejectedValue(new Error('DB Error'));

      const result = await updatePlat({
        id: 1,
        plat: 'Test',
      });

      expect(result.serverError).toBeDefined();
    });
  });

  describe('deletePlat', () => {
    it('should soft delete plat (set est_epuise to true)', async () => {
      (prisma.plats_db.update as any).mockResolvedValue({
        idplats: 1,
        est_epuise: true,
      });

      const result = await deletePlat({ id: 1 });

      expect(result.data).toMatchObject({
        success: true,
        id: 1,
      });
      expect(prisma.plats_db.update).toHaveBeenCalledWith({
        where: { idplats: 1 },
        data: { est_epuise: true },
      });
    });

    it('should reject invalid ID', async () => {
      const result = await deletePlat({ id: -1 } as any);

      expect(result.validationErrors).toBeDefined();
    });

    it('should throw error on database failure', async () => {
      (prisma.plats_db.update as any).mockRejectedValue(new Error('DB Error'));

      const result = await deletePlat({ id: 1 });

      expect(result.serverError).toBeDefined();
    });
  });

  describe('Data transformations', () => {
    it('should convert prix from number to string', async () => {
      const mockPlat = {
        idplats: 1,
        plat: 'Test',
        categorie: 'Test',
        description: 'Test',
        prix: 15.99,
        est_epuise: false,
        epuise_depuis: null,
        epuise_jusqu_a: null,
        image_url: null,
      };

      (prisma.plats_db.findMany as any).mockResolvedValue([mockPlat]);

      const result = await getPlats();

      expect(typeof result[0].prix).toBe('string');
      expect(result[0].prix).toBe('15.99');
    });

    it('should convert dates to ISO strings', async () => {
      const now = new Date();
      const mockPlat = {
        idplats: 1,
        plat: 'Test',
        categorie: 'Test',
        description: 'Test',
        prix: 10,
        est_epuise: true,
        epuise_depuis: now,
        epuise_jusqu_a: now,
        image_url: null,
      };

      (prisma.plats_db.findMany as any).mockResolvedValue([mockPlat]);

      const result = await getPlats();

      expect(result[0].epuise_depuis).toBe(now.toISOString());
      expect(result[0].epuise_jusqu_a).toBe(now.toISOString());
    });

    it('should handle null prix gracefully', async () => {
      const mockPlat = {
        idplats: 1,
        plat: 'Test',
        categorie: 'Test',
        description: 'Test',
        prix: null,
        est_epuise: false,
        epuise_depuis: null,
        epuise_jusqu_a: null,
        image_url: null,
      };

      (prisma.plats_db.findMany as any).mockResolvedValue([mockPlat]);

      const result = await getPlats();

      expect(result[0].prix).toBeNull();
    });
  });
});
