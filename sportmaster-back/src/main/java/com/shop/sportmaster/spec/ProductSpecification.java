package com.shop.sportmaster.spec;


import com.shop.sportmaster.model.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> filter(
            String name,
            String brand,
            Long categoryId,
            String size,
            String color,
            Integer priceMin,
            Integer priceMax
    ) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (name != null && !name.isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("name")),
                                "%" + name.toLowerCase() + "%"
                        )
                );
            }

            if (brand != null && !brand.isBlank()) {
                predicates.add(
                        cb.equal(
                                cb.lower(root.get("brand")),
                                brand.toLowerCase()
                        )
                );
            }

            if (categoryId != null) {
                predicates.add(
                        cb.equal(root.get("category").get("id"), categoryId)
                );
            }

            if (size != null && !size.isBlank()) {
                predicates.add(
                        cb.equal(root.get("size"), size)
                );
            }

            if (color != null && !color.isBlank()) {
                predicates.add(
                        cb.equal(root.get("color"), color)
                );
            }

            if (priceMin != null) {
                predicates.add(
                        cb.greaterThanOrEqualTo(
                                root.get("price"), priceMin
                        )
                );
            }

            if (priceMax != null) {
                predicates.add(
                        cb.lessThanOrEqualTo(
                                root.get("price"), priceMax
                        )
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
