// Datos del menú de la pizzería
const menuItems = [
    {
        id: 1,
        name: "Pizza Margarita",
        description: "Salsa de tomate, mozzarella fresca, albahaca y aceite de oliva",
        price: 12.99,
        category: "tradicional",
        emoji: "🍕",
        ingredients: ["Tomate", "Mozzarella", "Albahaca"]
    },
    {
        id: 2,
        name: "Pizza Pepperoni",
        description: "Salsa de tomate, mozzarella y pepperoni picante",
        price: 14.99,
        category: "tradicional",
        emoji: "🌶️",
        ingredients: ["Tomate", "Mozzarella", "Pepperoni"]
    },
    {
        id: 3,
        name: "Pizza Hawaiana",
        description: "Salsa de tomate, mozzarella, jamón y piña tropical",
        price: 15.99,
        category: "especial",
        emoji: "🍍",
        ingredients: ["Tomate", "Mozzarella", "Jamón", "Piña"]
    },
    {
        id: 4,
        name: "Pizza 4 Quesos",
        description: "Mezcla de mozzarella, gorgonzola, parmesano y fontina",
        price: 16.99,
        category: "especial",
        emoji: "🧀",
        ingredients: ["Mozzarella", "Gorgonzola", "Parmesano", "Fontina"]
    },
    {
        id: 5,
        name: "Pizza Vegetariana",
        description: "Pimientos, champiñones, cebolla, aceitunas y maíz",
        price: 13.99,
        category: "vegetariana",
        emoji: "🥦",
        ingredients: ["Pimientos", "Champiñones", "Cebolla", "Aceitunas", "Maíz"]
    },
    {
        id: 6,
        name: "Pizza BBQ Chicken",
        description: "Pollo a la barbacoa, cebolla caramelizada y cilantro",
        price: 17.99,
        category: "especial",
        emoji: "🍗",
        ingredients: ["Pollo BBQ", "Cebolla caramelizada", "Cilantro"]
    },
    {
        id: 7,
        name: "Pizza Caprese",
        description: "Mozzarella de búfala, tomate fresco y pesto",
        price: 14.99,
        category: "vegetariana",
        emoji: "🍅",
        ingredients: ["Mozzarella di Bufala", "Tomate", "Pesto"]
    },
    {
        id: 8,
        name: "Pizza Mexicana",
        description: "Carne picante, jalapeños, maíz y salsa de frijoles",
        price: 16.99,
        category: "especial",
        emoji: "🇲🇽",
        ingredients: ["Carne picante", "Jalapeños", "Maíz", "Frijoles"]
    },
    {
        id: 9,
        name: "Pizza Napolitana",
        description: "Anchoas, alcaparras, aceitunas y orégano",
        price: 15.99,
        category: "tradicional",
        emoji: "🇮🇹",
        ingredients: ["Anchoas", "Alcaparras", "Aceitunas", "Orégano"]
    }
];

// Función para obtener la categoría en español
function getCategoryName(category) {
    const categories = {
        "tradicional": "Tradicional",
        "especial": "Especial",
        "vegetariana": "Vegetariana"
    };
    return categories[category] || category;
}

// Función para obtener el color de la categoría
function getCategoryColor(category) {
    const colors = {
        "tradicional": "badge-tradicional",
        "especial": "badge-especial",
        "vegetariana": "badge-vegetariana"
    };
    return colors[category] || "";
}
