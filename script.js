// Fetch and load the JSON data
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Generate the virtues menu (left column)
    generateVirtuesMenu(data.categories);
    // Generate the interactive sections (right column)
    generateInteractiveSections(data.categories);
  })
  .catch(error => console.error('Error loading data:', error));

function generateVirtuesMenu(categories) {
  const virtuesContainer = document.querySelector('.virtues');
  virtuesContainer.innerHTML = ''; // Clear existing content

  categories.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'virtue-category';
    categoryDiv.id = `virtue-${category.id}`;

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

        const virtuesList = document.createElement('ul');
        subcategory.virtues.forEach(virtue => {
          const virtueItem = createVirtueListItem(virtue);
          virtuesList.appendChild(virtueItem);
        });
        categoryDiv.appendChild(virtuesList);
      });
    } else if (category.virtues) {
      // If no subcategories, display virtues directly
      const virtuesList = document.createElement('ul');
      category.virtues.forEach(virtue => {
        const virtueItem = createVirtueListItem(virtue);
        virtuesList.appendChild(virtueItem);
      });
      categoryDiv.appendChild(virtuesList);
    }

    virtuesContainer.appendChild(categoryDiv);
  });
}

function createVirtueListItem(virtue) {
  const li = document.createElement('li');
  li.setAttribute('data-target', virtue.id);
  li.textContent = virtue.name;
  return li;
}

function generateInteractiveSections(categories) {
  const rightColumn = document.querySelector('.right-column');
  rightColumn.innerHTML = ''; // Clear existing content

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
  document.querySelectorAll('.virtue-category li').forEach(li => {
    li.addEventListener('click', () => {
      const targetId = li.getAttribute('data-target');
      
      // Remove active class from all items
      document.querySelectorAll('.virtue-category li').forEach(item => {
        item.classList.remove('active-item');
      });
      
      // Add active class to clicked item
      li.classList.add('active-item');
      
      // Hide all details first
      document.querySelectorAll('.detail').forEach(detail => {
        detail.style.display = 'none';
        detail.classList.remove('active');
      });
      
      // Show selected detail with animation
      const targetDetail = document.getElementById(targetId);
      if (targetDetail) {
        targetDetail.style.display = 'block';
        // Trigger reflow
        void targetDetail.offsetWidth;
        targetDetail.classList.add('active');
      }
    });
  });

  // Show first virtue by default
  const firstVirtueItem = document.querySelector('.virtue-category li');
  if (firstVirtueItem) {
    firstVirtueItem.click();
  }
}

function createVirtueDetail(virtue) {
  const detailDiv = document.createElement('div');
  detailDiv.className = 'detail';
  detailDiv.id = virtue.id;
  detailDiv.style.display = 'none';

  const title = document.createElement('h2');
  title.textContent = virtue.name;
  detailDiv.appendChild(title);

  virtue.content.forEach(text => {
    const p = document.createElement('p');
    p.textContent = text;
    detailDiv.appendChild(p);
  });

  return detailDiv;
}