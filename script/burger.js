"use strict";

document.addEventListener("DOMContentLoaded", function() {
  const scrollController = {
    scrollPosition: 0,
    isScrollDisabled: false,
    disabledScroll() {
      scrollController.scrollPosition = window.scrollY;
      document.body.style.cssText = `
        overflow: hidden;
        position: fixed;
        top: -${scrollController.scrollPosition}px;
        left: 0;
        height: 100vh;
        width: 100vw;
        padding-right: ${window.innerWidth - document.body.offsetWidth}px
      `;
      document.documentElement.style.scrollBehavior = 'unset';
      this.isScrollDisabled = true;
    },
    enabledScroll() {
      document.body.style.cssText = '';
      window.scroll({top: scrollController.scrollPosition})
      document.documentElement.style.scrollBehavior = '';
      this.isScrollDisabled = false;
    },
  }
  let modalOpened = false;
  
  const modalController = ({modal, btnOpen, btnClose, time = 300}) => {
    const buttonElems = document.querySelectorAll(btnOpen);
    const modalElem = document.querySelector(modal);
  
    modalElem.style.cssText = `
      display: flex;
      visibility: hidden;
      opacity: 0;
      transition: opacity ${time}ms ease-in-out;
    `;
  
    const closeModal = event => {
      const target = event.target;
  
      if (
        target === modalElem ||
        (btnClose && target.closest(btnClose)) ||
        event.code === 'Escape'
        ) {
        
        modalElem.style.opacity = 0;
  
        setTimeout(() => {
          modalElem.style.visibility = 'hidden';
          if (modalOpened) {
            modalOpened = false;
            scrollController.enabledScroll();
          }
        }, time);
  
        window.removeEventListener('keydown', closeModal);
      }
    }
  
    const openModal = () => {
      if (!modalOpened) {
        modalOpened = true;
        modalElem.style.visibility = 'visible';
        modalElem.style.opacity = 1;
        window.addEventListener('keydown', closeModal);
        scrollController.disabledScroll();
      }
    };
  
    buttonElems.forEach(btn => {
      btn.addEventListener('click', openModal);
    });
  
  
    modalElem.addEventListener('click', closeModal);
  };
  modalController({
    modal: '.modal1',
    btnOpen: '.btn_modal1',
    btnClose: '.modal__close',
  });


  //burger
  const burger = document.querySelector('.burger');
  const navigation = document.querySelector('.navigation');
  if (burger) {
    burger.addEventListener('click', () => {
      if (!scrollController.isScrollDisabled) {
        scrollController.disabledScroll();
      } else {
        scrollController.enabledScroll();
      }
      burger.classList.toggle('burger_active');
      navigation.classList.toggle('navigation_active');
    });
  }
  // scroll and close burger after clicking navigation buttons
  const navLinks = document.querySelectorAll('.navigation__link[data-goto]');
  const allNavLinks = document.querySelectorAll('.navigation__link');

  navLinks.forEach(navLink => {
    navLink.addEventListener('click', onNavLinkClick);
  });

  function onNavLinkClick(e) {
    const navLink = e.target;
    if (navLink.dataset.goto && document.querySelector(navLink.dataset.goto)) {
      const gotoBlock = document.querySelector(navLink.dataset.goto);
      const gotoBlockValue = gotoBlock.getBoundingClientRect().top + window.scrollY - document.querySelector('header').offsetHeight;

      allNavLinks.forEach(allNavLink => {
        allNavLink.classList.remove('navigation__link_active');
      })
      navLink.classList.add('navigation__link_active');
      if (burger.classList.contains('burger_active')) {
        burger.classList.remove('burger_active');
        navigation.classList.remove('navigation_active');
      }
      if (scrollController.isScrollDisabled) {
        scrollController.enabledScroll();
      }

      window.scrollTo({
        top: gotoBlockValue,
        behavior: 'smooth'
      });
      e.preventDefault();
    }
  }
});
