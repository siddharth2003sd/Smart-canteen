package com.smartcanteen.repository;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

public class StorageRepository<T> {
    private final String filePath;
    private final Function<String, T> mapper;

    public StorageRepository(String filePath, Function<String, T> mapper) {
        this.filePath = filePath;
        this.mapper = mapper;
        ensureFileExists();
    }

    private void ensureFileExists() {
        File file = new File(filePath);
        if (!file.exists()) {
            try {
                file.getParentFile().mkdirs();
                file.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public List<T> getAll() {
        List<T> items = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                if (!line.trim().isEmpty()) {
                    items.add(mapper.apply(line));
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return items;
    }

    public void saveAll(List<T> items) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(filePath))) {
            for (T item : items) {
                bw.write(item.toString());
                bw.newLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void add(T item) {
        List<T> items = getAll();
        items.add(item);
        saveAll(items);
    }
}
