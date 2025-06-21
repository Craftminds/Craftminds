# CraftMinds Comptabilité

Une application web moderne et intuitive pour la gestion de votre comptabilité professionnelle.

## 🌟 Fonctionnalités

- **Gestion des revenus et dépenses**
  - Suivi en temps réel de vos transactions
  - Catégorisation automatique des entrées et sorties
  - Interface intuitive pour l'ajout de transactions

- **Tableau de bord**
  - Vue d'ensemble de vos finances
  - Affichage des totaux de revenus et dépenses
  - Calcul automatique du profit

- **Import/Export de données**
  - Export de vos données au format CSV
  - Import de données depuis des fichiers CSV
  - Sauvegarde automatique des données localement

## 🚀 Installation

1. Installez les dépendances :
```bash
npm install
```

2. Lancez l'application en mode développement :
```bash
npm run dev
```

## 💻 Utilisation

### Ajouter une transaction
1. Sélectionnez l'onglet "Revenus" ou "Dépenses"
2. Cliquez sur le bouton d'ajout
3. Remplissez les informations requises
4. Validez l'ajout

### Importer des données
1. Préparez votre fichier CSV avec les colonnes suivantes :
   - type (revenue/expense)
   - date (YYYY-MM-DD)
   - client
   - service
   - montant
2. Cliquez sur "Importer CSV"
3. Sélectionnez votre fichier

### Exporter des données
1. Cliquez sur "Exporter CSV"
2. Le fichier sera automatiquement téléchargé

## 🔒 Sécurité

- Les données sont stockées localement dans votre navigateur
- Aucune donnée n'est envoyée à des serveurs externes
- Validation des données à l'importation
- Protection contre les injections de données malveillantes

## 🛠️ Technologies utilisées

- React
- TypeScript
- Tailwind CSS
- Vite

## 📝 Format du fichier CSV

Exemple de fichier CSV valide :
```csv
type,date,client,service,montant
revenue,2024-03-20,Client A,Service 1,1000
expense,2024-03-20,Fournisseur B,Service 2,500
```

## 🤝 Support

Pour toute question ou assistance, n'hésitez pas à :
- Ouvrir une issue sur GitHub
- Contacter notre support client

## 📄 Licence

© 2024 CraftMinds. Tous droits réservés.
