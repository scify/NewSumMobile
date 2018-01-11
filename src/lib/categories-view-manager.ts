export class CategoriesViewManager {
  private static map = {
    'Επιστήμη': '../../assets/imgs/categories/science.jpg',
    'Οικονομία': '../../assets/imgs/categories/economics.jpg',
    'Κόσμος': '../../assets/imgs/categories/world3.jpg',
    'Πολιτισμός': '../../assets/imgs/categories/civilization.jpg',
    'Αθλητισμός': '../../assets/imgs/categories/sports.jpg',
    'Τεχνολογία': '../../assets/imgs/categories/tech.jpg',
    'Ελλάδα': '../../assets/imgs/categories/civilization2.jpg',
    'SciFY News': '../../assets/imgs/categories/scify_logo.png',
    'Γενικά': '../../assets/imgs/categories/newspaper.jpg'
  };

  public static getCategoryDefaultImage(category: string): string {
    return CategoriesViewManager.map[category];
  }
}
