export interface ICategoryIcons {
  name: string;
  image: string;
}

interface IFilteredCategoryIcons {
  normal: string;
  small: string;
  blue: string;
  white: string;
}

export const filterCategoryIcons = (icons: ICategoryIcons[]): IFilteredCategoryIcons => {
  const categoryIcons = {
    normal: '',
    small: '',
    blue: '',
    white: ''
  };

  icons.forEach(({name, image}) => {
    const [prefix] = name.split('-');
    const [, suffix] = name.split(prefix);

    switch(suffix) {
      case '-s': {
        categoryIcons.small = image;
        break;
      };
      case '-s-b': {
        categoryIcons.blue = image;
        break;
      };
      case '-w': {
        categoryIcons.white = image;
        break;
      };
      default: {
        categoryIcons.normal = image;
        break;
      };
    }
  });

  return categoryIcons;
};
