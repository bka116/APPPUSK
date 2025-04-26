import React, { useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockObjects = Array.from({ length: 20 }, (_, index) => ({
  id: (index + 1).toString(),
  title: `Объект №${index + 1}`,
  address: `г. Москва, ул. Строителей, д.${index + 1}`,
  type: index % 2 === 0 ? 'Жилой дом' : 'Офисное здание',
  event: index % 2 === 0 ? 'Госэкспертиза' : 'Частные инвестиции',
  violations: Math.floor(Math.random() * 10),
}));

const OBJECTS_PER_PAGE = 10;

export default function ObjectsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const flatListRef = useRef(null);

  const filteredObjects = mockObjects.filter(obj =>
    obj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obj.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredObjects.length / OBJECTS_PER_PAGE);

  const startIndex = (currentPage - 1) * OBJECTS_PER_PAGE;
  const endIndex = startIndex + OBJECTS_PER_PAGE;
  const currentObjects = filteredObjects.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 16 }}>
      {/* Поиск + Фильтр + Сортировка */}
      <View style={styles.topBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="filter-outline" size={24} color="#2566E8" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="swap-vertical-outline" size={24} color="#2566E8" />
        </TouchableOpacity>
      </View>

      {/* Количество объектов */}
      <Text style={styles.countText}>Найдено объектов: {filteredObjects.length}</Text>

      {/* Список объектов */}
      <FlatList
        ref={flatListRef}
        data={currentObjects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 10, // чтобы между пагинацией и футером оставался воздух
        }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>№{item.id} {item.title}</Text>
            <Text style={styles.cardText}>Адрес: {item.address}</Text>
            <Text style={styles.cardText}>Тип: {item.type}</Text>
            <Text style={styles.cardText}>Мероприятие: {item.event}</Text>
            <Text style={styles.cardViolation}>Нарушения: {item.violations}</Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={styles.pagination}>
            <TouchableOpacity
              onPress={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
            >
              <Ionicons name="chevron-back-outline" size={24} color="#2566E8" />
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Array.from({ length: totalPages }, (_, index) => (
                <TouchableOpacity
                  key={index + 1}
                  onPress={() => goToPage(index + 1)}
                  style={[
                    styles.pageNumberButton,
                    currentPage === index + 1 && styles.activePageButton
                  ]}
                >
                  <Text style={[
                    styles.pageNumberText,
                    currentPage === index + 1 && styles.activePageText
                  ]}>
                    {index + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
            >
              <Ionicons name="chevron-forward-outline" size={24} color="#2566E8" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  searchInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 12, paddingHorizontal: 12, height: 40 },
  iconButton: { marginLeft: 10 },
  countText: { marginBottom: 8, fontSize: 16, color: '#333' },
  card: { backgroundColor: '#F5F7FF', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#2566E8', marginBottom: 4 },
  cardText: { fontSize: 14, color: '#333' },
  cardViolation: { fontSize: 14, color: 'red', marginTop: 4, fontWeight: '600' },
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 },
  pageButton: { padding: 8, borderRadius: 8 },
  disabledButton: { opacity: 0.4 },
  pageNumberButton: { paddingHorizontal: 12, paddingVertical: 6, marginHorizontal: 4, borderRadius: 8, backgroundColor: '#F0F0F0' },
  activePageButton: { backgroundColor: '#2566E8' },
  pageNumberText: { color: '#2566E8', fontWeight: '600' },
  activePageText: { color: 'white' },
});
