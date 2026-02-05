package com.shop.sportmaster.service;

import com.shop.sportmaster.dto.GuestOrderItem;
import com.shop.sportmaster.dto.GuestOrderRequest;
import com.shop.sportmaster.model.*;
import com.shop.sportmaster.repository.*;
import com.shop.sportmaster.status.OrderStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    // ---------- АВТОРИЗОВАННЫЙ ----------
    public Order createOrder(User user) {
        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Корзина пуста");
        }

        Order order = new Order();
        order.setUser(user);
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.NEW);

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            int quantity = cartItem.getQuantity();

            if (product.getStock() < quantity) {
                throw new RuntimeException("Недостаточно товара: " + product.getName());
            }

            // Уменьшаем остаток
            product.setStock(product.getStock() - quantity);
            productRepository.save(product); // ← сохраняем изменения

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setPriceAtOrder(product.getPrice());

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
            orderItems.add(item);
        }

        order.setTotalPrice(total);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        cartItemRepository.deleteByUser(user); // очищаем корзину

        return savedOrder;
    }

    // ---------- ГОСТЕВОЙ ----------
    public Order createGuestOrder(GuestOrderRequest request) {
        Order order = new Order();
        // Заполняем данные гостя напрямую
        order.setGuestFullName(request.getFullName());
        order.setGuestEmail(request.getEmail());
        order.setGuestPhone(request.getPhone());
        order.setGuestCity(request.getCity());
        order.setGuestCountry(request.getCountry());

        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.NEW);

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        for (GuestOrderItem dto : request.getCartItems()) {
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Товар не найден: ID=" + dto.getProductId()));

            if (product.getStock() < dto.getQuantity()) {
                throw new RuntimeException("Недостаточно товара: " + product.getName());
            }

            // Уменьшаем остаток
            product.setStock(product.getStock() - dto.getQuantity());
            productRepository.save(product); // ← сохраняем изменения

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(dto.getQuantity());
            item.setPriceAtOrder(product.getPrice());

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(dto.getQuantity())));
            items.add(item);
        }

        order.setTotalPrice(total);
        order.setItems(items);

        return orderRepository.save(order);
    }



    public List<Order> getUserOrders(User user) {
        List<Order> orders = orderRepository.findByUser(user);

        LocalDateTime now = LocalDateTime.now();
        for (Order order : orders) {
            if (order.getStatus() == OrderStatus.NEW &&
                    order.getCreatedAt().isBefore(now.minusHours(1))) {
                order.setStatus(OrderStatus.COMPLETED);
                orderRepository.save(order);
            }
        }

        return orders;
    }
}