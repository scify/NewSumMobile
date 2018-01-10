export class TextManipulationService {
  public static getUppercaseFriendlyText(text: string): string {
    if (text) {
      let map = {
        'Ά': 'Α',
        'Έ': 'Ε',
        'Ί': 'Ι',
        'Ό': 'Ο',
        'Ύ': 'Υ',
        'Ή': 'Η',
        'Ώ': 'Ω',
        'ά': 'α',
        'έ': 'ε',
        'ί': 'ι',
        'ό': 'ο',
        'ύ': 'υ',
        'ϋ': 'υ',
        'ϊ': 'ι',
        'ή': 'η',
        'ώ': 'ω'
      };
      return text.toLowerCase().replace(/[ΆΈΊΌΎΉΏάέίϊήόύϋώ]+/g, function (letter) {
        return map[letter];
      });
    } else {
      return text;
    }
  }
}
