package com.smartcanteen.service;

import com.smartcanteen.model.FoodItem;
import com.smartcanteen.repository.StorageRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class MenuService {
    private final StorageRepository<FoodItem> foodRepository;

    public MenuService() {
        this.foodRepository = new StorageRepository<>("data/menu.csv", line -> {
            String[] parts = line.split(",");
            return new FoodItem(parts[0], parts[1], Double.parseDouble(parts[2]), parts[3], Boolean.parseBoolean(parts[4]));
        });
    }

    public List<FoodItem> getMenu() {
        return foodRepository.getAll();
    }

    public List<FoodItem> getAvailableMenu() {
        return foodRepository.getAll().stream().filter(FoodItem::isAvailable).collect(Collectors.toList());
    }

    public void addFoodItem(String name, double price, String category) {
        foodRepository.add(new FoodItem(UUID.randomUUID().toString(), name, price, category, true));
    }

    public void updateFoodItem(FoodItem item) {
        List<FoodItem> items = foodRepository.getAll();
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).getId().equals(item.getId())) {
                items.set(i, item);
                break;
            }
        }
        foodRepository.saveAll(items);
    }

    public void removeFoodItem(String id) {
        List<FoodItem> items = foodRepository.getAll();
        items.removeIf(item -> item.getId().equals(id));
        foodRepository.saveAll(items);
    }
    
    public FoodItem getFoodItemById(String id) {
        return foodRepository.getAll().stream().filter(f -> f.getId().equals(id)).findFirst().orElse(null);
    }
}
