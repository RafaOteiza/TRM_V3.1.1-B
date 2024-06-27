/**
* Template Name: Knight
* Updated: Mar 17 2024 with Bootstrap v5.3.3
*/

(function() {
  "use strict";

  /**
   * Función auxiliar de selección fácil
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Función auxiliar de escucha de eventos
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Función auxiliar de escucha de eventos de desplazamiento
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navegacion en la barra al desplazarse
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Desplaza a un elemento con el desplazamiento del encabezado
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Encabezado fijo al desplazarse
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    let headerOffset = selectHeader.offsetTop
    let nextElement = selectHeader.nextElementSibling
    const headerFixed = () => {
      if ((headerOffset - window.scrollY) <= 0) {
        selectHeader.classList.add('fixed-top')
        nextElement.classList.add('scrolled-offset')
      } else {
        selectHeader.classList.remove('fixed-top')
        nextElement.classList.remove('scrolled-offset')
      }
    }
    window.addEventListener('load', headerFixed)
    onscroll(document, headerFixed)
  }

  /**
   * Boton volver al inicio
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

})()

  /**
   * Script llamado Json Promociones
   */
  document.addEventListener("DOMContentLoaded", function() {
    fetch('/static/js/promociones.json')
        .then(response => response.json())
        .then(data => updatePricingSection(data))
        .catch(error => console.error('Error loading the promotions:', error));

    function updatePricingSection(promotions) {
        const container = document.getElementById('promotions-container');
        container.innerHTML = ''; // Limpiar contenido existente
        promotions.forEach(promo => {
            if (promo.id !== undefined) {
                const htmlContent = `
                    <div class="col-lg-4 col-md-6 mb-3">
                        <div class="box" data-aos="zoom-in" data-aos-delay="100">
                            <h3>${promo.titulo}</h3>
                            <h4><sup>$</sup>${promo.precio}</h4>
                            <ul>
                                ${promo.descripcion.map(line => `<li>${line}</li>`).join('')}
                            </ul>
                            <div class="btn-wrap">
                                <a href="/add_to_cart/${promo.id}/" class="btn-buy">Comprar</a>
                            </div>
                        </div>
                    </div>`;
                container.innerHTML += htmlContent;
            } else {
                console.error('Promotion ID is undefined:', promo);
            }
        });
    }
});


  /**
   * Script Usuario
   */

document.addEventListener("DOMContentLoaded", function() {
  // Obtener el correo electrónico del usuario autenticado (podrías obtenerlo de tu sistema de autenticación)
  var userEmail = 'luis@duocuc.cl'; // Reemplazar con el correo electrónico del usuario autenticado

  // Lista de usuarios
  var users = [
    { email: 'rafa@duocuc.cl', password: '123456', name: 'Rafael', lastName: 'Oteiza', phone: '123456789', comuna: 'Santiago', auto: 'Toyota Yaris' },
    { email: 'luis@duocuc.cl', password: '123456', name: 'Luis', lastName: 'Arenas', phone: '123456789', comuna: 'Santiago', auto: 'Peugeot 2008' },
    { email: 'matias@duocuc.cl', password: '123456', name: 'Matias', lastName: 'Garrido', phone: '123456789', comuna: 'Santiago', auto: 'Audi A3' }
  ];

  // Encontrar el usuario correspondiente al correo electrónico autenticado
  var authenticatedUser = users.find(function(user) {
    return user.email === userEmail;
  });

  // Si el usuario está autenticado, mostrar su información en la página usuario.html
  if (authenticatedUser) {
    document.getElementById("name").textContent = authenticatedUser.name;
    document.getElementById("lastName").textContent = authenticatedUser.lastName;
    document.getElementById("email").textContent = authenticatedUser.email;
    document.getElementById("phone").textContent = authenticatedUser.phone;
    document.getElementById("comuna").textContent = authenticatedUser.comuna;
    document.getElementById("auto").textContent = authenticatedUser.auto;
  } else {
    // Si el usuario no está autenticado, redirigirlo a la página de inicio de sesión
    window.location.href = '../index.html'; 
  }
});

  /**
   * PROFE: REVISAR DESDE AQUI HACIA ABAJO LO SOLICITADO!
   */

  /**
   * Script Contacto con JQuery
   */
  $(document).ready(function() {
    const $form = $('#contact-form');
    const $loadingMessage = $('.loading');
    const $errorMessage = $('.error-message');
    const $sentMessage = $('.sent-message');
    const $emailInput = $('#email');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    $form.submit(function(e) {
        e.preventDefault();

        // Validar el email
        const email = $emailInput.val();
        if (!validateEmail(email)) {
            $errorMessage.text('Por favor, introduce un correo electrónico válido.');
            $errorMessage.show();
            $loadingMessage.hide();
            $sentMessage.hide();
            return;
        }

        // Mostrar mensaje de carga
        $loadingMessage.show();
        $errorMessage.hide();
        $sentMessage.hide();

        // Recoger datos del formulario
        const formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            subject: $('#subject').val(),
            message: $('#message').val()
        };

        try {
            // Guardar los datos en localStorage
            let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
            contacts.push(formData);
            localStorage.setItem('contacts', JSON.stringify(contacts));

            // Simular un pequeño retraso para la demostración
            setTimeout(() => {
                // Mostrar mensaje de éxito
                $loadingMessage.hide();
                $sentMessage.show();
                $form[0].reset(); // Reiniciar el formulario
            }, 1000); // Ajustar el tiempo del retraso según sea necesario
        } catch (error) {
            console.error('Error al guardar los datos en localStorage', error);
            $errorMessage.text('Ocurrió un error al enviar el formulario. Por favor, inténtalo de nuevo.');
            $errorMessage.show();
            $loadingMessage.hide();
        }
    });
});
