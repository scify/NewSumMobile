export class CategoriesViewManager {
  private static map = {
    'Επιστήμη': 'assets/imgs/categories/science.jpg',
    'Οικονομία': 'assets/imgs/categories/economics.jpg',
    'Κόσμος': 'assets/imgs/categories/world3.jpg',
    'Πολιτισμός': 'assets/imgs/categories/civilization.jpg',
    'Αθλητισμός': 'assets/imgs/categories/sports.jpg',
    'Τεχνολογία': 'assets/imgs/categories/tech.jpg',
    'Ελλάδα': 'assets/imgs/categories/civilization2.jpg',
    'SciFY News': 'assets/imgs/categories/scify_logo_bg.png',
    'Γενικά': 'assets/imgs/categories/newspaper.jpg',
    'Science': 'assets/imgs/categories/science.jpg',
    'Business': 'assets/imgs/categories/economics.jpg',
    'World': 'assets/imgs/categories/world3.jpg',
    'Technology': 'assets/imgs/categories/tech.jpg',
    'Top News': 'assets/imgs/categories/newspaper.jpg',
    'Europe': 'assets/imgs/categories/europe.jpg',
    'Open Source': 'assets/imgs/categories/open_source.jpg'
  };

  public static getCategoryDefaultImage(category: string): string {
    return CategoriesViewManager.map[category];
  }
}
