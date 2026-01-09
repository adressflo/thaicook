import { getDocuments } from "@/app/actions/documents"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatPrice } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { FileText, Plus } from "lucide-react"
import Link from "next/link"

export default async function DocumentsPage() {
  const documents = await getDocuments()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Gestion des devis, factures et avoirs.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={"/admin/documents/preview-design" as any}>
              <FileText className="mr-2 h-4 w-4" /> Voir modèle PDF
            </Link>
          </Button>
          <Button asChild>
            <Link href={"/admin/documents/nouveau" as any}>
              <Plus className="mr-2 h-4 w-4" /> Nouveau Document
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Récents</CardTitle>
          <CardDescription>Liste de tous les documents générés sur la plateforme.</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="bg-muted rounded-full p-4">
                <FileText className="text-muted-foreground h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Aucun document</h3>
              <p className="text-muted-foreground mt-2 mb-4 max-w-sm text-sm">
                Vous n'avez pas encore créé de devis ou de facture. Commencez par en créer un
                nouveau.
              </p>
              <Button asChild variant="outline">
                <Link href="/admin/documents/nouveau">Créer mon premier document</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Montant TTC</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.numero_ref}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          doc.type === "DEVIS"
                            ? "border-blue-500 text-blue-500"
                            : doc.type === "FACTURE"
                              ? "border-green-500 text-green-500"
                              : "border-gray-500"
                        }
                      >
                        {doc.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{doc.nom_client_snapshot}</span>
                        {doc.client && (
                          <span className="text-muted-foreground text-xs">
                            Client ID: {doc.client.idclient}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(doc.date_creation), "dd MMM yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={doc.statut === "brouillon" ? "secondary" : "default"}>
                        {doc.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatPrice(Number(doc.total_ttc))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/documents/${doc.id}`}>Voir</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
