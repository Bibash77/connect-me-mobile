import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Chip, useTheme} from 'react-native-paper';
import {useThemedStyles} from '@hooks/useThemedStyles';
import {MD3Theme} from 'react-native-paper';

interface CategoryListProps {
  categories: string[];
  selectedCategories: string[];
  onSelectCategory: (category: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategories,
  onSelectCategory,
}) => {
  const styles = useThemedStyles(themedStyles);
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {categories.map(category => (
        <Chip
          key={category}
          selected={selectedCategories.includes(category)}
          onPress={() => onSelectCategory(category)}
          style={styles.chip}
          textStyle={styles.chipText}>
          {category}
        </Chip>
      ))}
    </ScrollView>
  );
};

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
    },
    chip: {
      marginRight: 8,
    },
    chipText: {
      ...theme.fonts.labelLarge,
    },
  });
