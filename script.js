// Fetch and load the JSON data
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Generate the categories menu (left column)
    generateCategoriesMenu(data.categories);
    // Generate the interactive sections (right column)
    generateInteractiveSections(data.categories);
  })
  .catch(error => console.error('Error loading data:', error));

function generateCategoriesMenu(categories) {
  const categoriesContainer = document.querySelector('.categories');
  categoriesContainer.innerHTML = ''; // Clear existing content

  categories.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'sub-category';
    categoryDiv.id = `category-${category.id}`;

    // Add category title
    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = category.name;
    categoryDiv.appendChild(categoryTitle);

    // Handle subcategories if they exist
    if (category.subcategories && category.subcategories.length > 0) {
      category.subcategories.forEach(subcategory => {
        const subcategoryTitle = document.createElement('h3');
        subcategoryTitle.textContent = subcategory.name;
        categoryDiv.appendChild(subcategoryTitle);

        const categoriesList = document.createElement('ul');
        subcategory.virtues.forEach(virtue => {
          const categoryItem = createCategoryListItem(virtue);
          categoriesList.appendChild(categoryItem);
        });
        categoryDiv.appendChild(categoriesList);
      });
    } else if (category.virtues) {
      // If no subcategories, display virtues directly
      const categoriesList = document.createElement('ul');
      category.virtues.forEach(virtue => {
        const categoryItem = createCategoryListItem(virtue);
        categoriesList.appendChild(categoryItem);
      });
      categoryDiv.appendChild(categoriesList);
    }

    categoriesContainer.appendChild(categoryDiv);
  });
}

function createCategoryListItem(virtue) {
  const li = document.createElement('li');
  li.setAttribute('data-target', virtue.id);
  li.textContent = virtue.name;
  return li;
}

function generateInteractiveSections(categories) {
  const rightColumn = document.querySelector('.right-column');
  rightColumn.innerHTML = ''; // Clear existing content

  // Add click handler to right column for mobile
  rightColumn.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      rightColumn.classList.remove('mobile-active');
    }
  });

  categories.forEach(category => {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'interactive-section';
    sectionDiv.id = category.id;

    if (category.subcategories && category.subcategories.length > 0) {
      category.subcategories.forEach(subcategory => {
        subcategory.virtues.forEach(virtue => {
          const detailDiv = createVirtueDetail(virtue);
          sectionDiv.appendChild(detailDiv);
        });
      });
    } else if (category.virtues) {
      category.virtues.forEach(virtue => {
        const detailDiv = createVirtueDetail(virtue);
        sectionDiv.appendChild(detailDiv);
      });
    }

    rightColumn.appendChild(sectionDiv);
  });

  // Add click event listeners
  document.querySelectorAll('.sub-category li').forEach(li => {
    li.addEventListener('click', (e) => {
      const targetId = li.getAttribute('data-target');
      
      // Remove active class from all items
      document.querySelectorAll('.sub-category li').forEach(item => {
        item.classList.remove('active-item');
      });
      
      // Add active class to clicked item
      li.classList.add('active-item');
      
      // Hide all details first
      document.querySelectorAll('.detail').forEach(detail => {
        detail.style.display = 'none';
        detail.classList.remove('active');
      });
      
      // Show the selected detail
      const targetDetail = document.getElementById(`detail-${targetId}`);
      if (targetDetail) {
        targetDetail.style.display = 'block';
        setTimeout(() => targetDetail.classList.add('active'), 10);
      }

      // Mobile-specific behavior
      if (window.innerWidth <= 768) {
        e.stopPropagation(); // Prevent the right column click handler from firing
        rightColumn.classList.add('mobile-active');
      }
    });
  });
}

function createVirtueDetail(virtue) {
  const detailDiv = document.createElement('div');
  detailDiv.className = 'detail';
  detailDiv.id = `detail-${virtue.id}`;

  const title = document.createElement('h2');
  title.textContent = virtue.name;
  detailDiv.appendChild(title);

  if (virtue.content) {
    virtue.content.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      detailDiv.appendChild(p);
    });
  }

  return detailDiv;
}