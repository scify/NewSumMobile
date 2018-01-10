export class CategoriesViewManager {
  private static map = {
    'Επιστήμη': 'science',
    'Οικονομία': 'economics',
    'Κόσμος': 'world',
    'Πολιτισμός': 'civilization',
    'Αθλητισμός': 'sports',
    'Τεχνολογία': 'tech',
    'Ελλάδα': 'greece',
    'SciFY News': 'scify',
    'Γενικά': 'general'
  };

  public static getCategoryCssClassName(category: string): string {
    return CategoriesViewManager.map[category];
  }
}
