package com.relish.menu;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface MenuItemRepository extends JpaRepository<MenuItem, UUID> {

	List<MenuItem> findByCategoryId(UUID categoryId);

}
