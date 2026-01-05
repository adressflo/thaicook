"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
// TODO: Ces hooks ont été supprimés avec Supabase, cette page nécessite migration Prisma
// import { useArticlesListeCourses, useCatalogueArticles, useListesCourses } from "@/hooks/useSupabaseData"

// Hooks stub temporaires - à remplacer par Prisma
const useCatalogueArticles = () => ({ data: [], refetch: () => {} })
const useListesCourses = () => ({ data: [], refetch: () => {} })
const useArticlesListeCourses = () => ({ data: [] })

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  AlertTriangle,
  Clock,
  Download,
  Edit,
  Euro,
  Eye,
  Package2,
  Plus,
  RefreshCw,
  Search,
  ShoppingCart,
} from "lucide-react"
import { useMemo, useState } from "react"

interface ArticleCourse {
  id: string
  nom: string
  categorie: string
  unite: string
  prix_unitaire: number
  stock_actuel: number
  stock_minimum: number
  fournisseur?: string
  derniere_commande?: string
  statut: "disponible" | "rupture" | "commande"
}

interface ListeCourse {
  id: string
  nom: string
  date_creation: string
  statut: "brouillon" | "validee" | "commandee" | "livree"
  total_estime: number
  nombre_articles: number
}

export default function AdminApprovisionnement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"articles" | "listes">("articles")
  const [selectedArticle, setSelectedArticle] = useState<ArticleCourse | null>(null)
  const [selectedListe, setSelectedListe] = useState<ListeCourse | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { data: catalogueArticles, refetch: refetchCatalogue } = useCatalogueArticles()
  const { data: listesCourses, refetch: refetchListes } = useListesCourses()
  const { data: articlesListeCourses } = useArticlesListeCourses()

  // Transformation des données du catalogue en format unifié
  const articles: ArticleCourse[] = useMemo(() => {
    if (!catalogueArticles) return []

    return catalogueArticles.map((article: any) => ({
      id: article.idarticles?.toString() || "",
      nom: article.nom_article || "Article sans nom",
      categorie: article.categorie_article || "Non catégorisé",
      unite: article.unite_mesure || "pcs",
      prix_unitaire: article.prix_unitaire || 0,
      stock_actuel: article.stock_actuel || 0,
      stock_minimum: article.stock_minimum || 5,
      fournisseur: article.fournisseur || "Non spécifié",
      derniere_commande: article.derniere_commande,
      statut:
        (article.stock_actuel || 0) <= (article.stock_minimum || 5) ? "rupture" : "disponible",
    }))
  }, [catalogueArticles])

  // Transformation des listes de courses
  const listes: ListeCourse[] = useMemo(() => {
    if (!listesCourses) return []

    return listesCourses.map((liste: any) => ({
      id: liste.idliste?.toString() || "",
      nom: liste.nom_liste || "Liste sans nom",
      date_creation: liste.date_creation || new Date().toISOString(),
      statut:
        (liste.statut_liste as "brouillon" | "validee" | "commandee" | "livree") || "brouillon",
      total_estime: liste.total_estime || 0,
      nombre_articles: liste.nombre_articles || 0,
    }))
  }, [listesCourses])

  // Filtrage des articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.categorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.fournisseur &&
          article.fournisseur.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || article.categorie === selectedCategory
      const matchesStatus = statusFilter === "all" || article.statut === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [articles, searchTerm, selectedCategory, statusFilter])

  // Filtrage des listes
  const filteredListes = useMemo(() => {
    return listes.filter((liste) => {
      const matchesSearch = liste.nom.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || liste.statut === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [listes, searchTerm, statusFilter])

  // Statistiques
  const stats = useMemo(() => {
    const totalArticles = articles.length
    const articlesEnRupture = articles.filter((a) => a.statut === "rupture").length
    const articlesDisponibles = articles.filter((a) => a.statut === "disponible").length
    const valeursStock = articles.reduce((sum, a) => sum + a.stock_actuel * a.prix_unitaire, 0)

    const listesActives = listes.filter((l) => l.statut !== "livree").length
    const totalEstimeListes = listes.reduce((sum, l) => sum + l.total_estime, 0)

    return {
      totalArticles,
      articlesEnRupture,
      articlesDisponibles,
      valeursStock,
      listesActives,
      totalEstimeListes,
    }
  }, [articles, listes])

  // Catégories uniques
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(articles.map((a) => a.categorie))]
    return uniqueCategories.sort()
  }, [articles])

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "disponible":
        return "bg-green-100 text-green-800"
      case "rupture":
        return "bg-red-100 text-red-800"
      case "commande":
        return "bg-orange-100 text-orange-800"
      case "brouillon":
        return "bg-gray-100 text-gray-800"
      case "validee":
        return "bg-blue-100 text-blue-800"
      case "commandee":
        return "bg-orange-100 text-orange-800"
      case "livree":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case "rupture":
        return <AlertTriangle className="h-4 w-4" />
      case "disponible":
        return <Package2 className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-thai-green text-2xl font-bold">Approvisionnement & Stock</h1>
          <p className="text-sm text-gray-600">Gestion des articles et listes de courses</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (activeTab === "articles" ? refetchCatalogue() : refetchListes())}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === "articles" ? "Nouvel Article" : "Nouvelle Liste"}
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200 bg-linear-to-r from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Articles</p>
                <p className="text-2xl font-bold text-blue-700">{stats.totalArticles}</p>
                <p className="text-xs text-blue-500">{stats.articlesDisponibles} disponibles</p>
              </div>
              <Package2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-linear-to-r from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Articles en Rupture</p>
                <p className="text-2xl font-bold text-red-700">{stats.articlesEnRupture}</p>
                <p className="text-xs text-red-500">Action requise</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-linear-to-r from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Valeur Stock</p>
                <p className="text-2xl font-bold text-green-700">
                  {stats.valeursStock.toFixed(2)}€
                </p>
                <p className="text-xs text-green-500">Stock actuel</p>
              </div>
              <Euro className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-linear-to-r from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Listes Actives</p>
                <p className="text-2xl font-bold text-orange-700">{stats.listesActives}</p>
                <p className="text-xs text-orange-500">
                  {stats.totalEstimeListes.toFixed(2)}€ estimé
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets */}
      <div className="flex w-fit space-x-1 rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab("articles")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "articles"
              ? "text-thai-green bg-white shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Articles du Catalogue
        </button>
        <button
          onClick={() => setActiveTab("listes")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "listes"
              ? "text-thai-green bg-white shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Listes de Courses
        </button>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder={
                    activeTab === "articles"
                      ? "Rechercher un article..."
                      : "Rechercher une liste..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {activeTab === "articles" && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="focus:ring-thai-green rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
              >
                <option value="all">Toutes catégories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="focus:ring-thai-green rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
            >
              <option value="all">Tous statuts</option>
              {activeTab === "articles" ? (
                <>
                  <option value="disponible">Disponible</option>
                  <option value="rupture">Rupture</option>
                  <option value="commande">En commande</option>
                </>
              ) : (
                <>
                  <option value="brouillon">Brouillon</option>
                  <option value="validee">Validée</option>
                  <option value="commandee">Commandée</option>
                  <option value="livree">Livrée</option>
                </>
              )}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal */}
      {activeTab === "articles" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-thai-green text-lg">{article.nom}</CardTitle>
                    <p className="text-sm text-gray-600">{article.categorie}</p>
                  </div>
                  <Badge className={getStatusColor(article.statut)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(article.statut)}
                      {article.statut}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stock actuel:</span>
                    <span
                      className={`font-medium ${
                        article.stock_actuel <= article.stock_minimum
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {article.stock_actuel} {article.unite}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stock minimum:</span>
                    <span className="font-medium">
                      {article.stock_minimum} {article.unite}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Prix unitaire:</span>
                    <span className="font-medium">{article.prix_unitaire.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fournisseur:</span>
                    <span className="font-medium">{article.fournisseur}</span>
                  </div>
                  {article.derniere_commande && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Dernière commande:</span>
                      <span className="font-medium">
                        {format(new Date(article.derniere_commande), "dd/MM/yyyy", { locale: fr })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedArticle(article)}>
                    <Eye className="mr-1 h-4 w-4" />
                    Voir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-1 h-4 w-4" />
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredArticles.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <Package2 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">Aucun article trouvé</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredListes.map((liste) => (
            <Card key={liste.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-thai-green text-lg">{liste.nom}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {format(new Date(liste.date_creation), "dd/MM/yyyy", { locale: fr })}
                    </p>
                  </div>
                  <Badge className={getStatusColor(liste.statut)}>{liste.statut}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nombre d'articles:</span>
                    <span className="font-medium">{liste.nombre_articles}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total estimé:</span>
                    <span className="font-medium">{liste.total_estime.toFixed(2)}€</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedListe(liste)}>
                    <Eye className="mr-1 h-4 w-4" />
                    Voir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-1 h-4 w-4" />
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredListes.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">Aucune liste trouvée</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
