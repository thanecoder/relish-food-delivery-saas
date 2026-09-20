package com.relish.user;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface AddressRepository extends JpaRepository<Address, UUID> {

	List<Address> findByUserId(UUID userId);

}
