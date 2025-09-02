// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })

    // Close menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active")
      })
    })
  }

  // Set minimum date for booking form
  const dateInput = document.getElementById("preferredDate")
  if (dateInput) {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    dateInput.min = tomorrow.toISOString().split("T")[0]
  }

  // Initialize booking form if on booking page
  if (document.getElementById("bookingForm")) {
    initializeBookingForm()
  }

  // Initialize contact form if on contact page
  if (document.getElementById("contactForm")) {
    initializeContactForm()
  }
})

// Booking Form Functionality
function initializeBookingForm() {
  const form = document.getElementById("bookingForm")
  const steps = document.querySelectorAll(".form-step")
  const stepIndicators = document.querySelectorAll(".booking-steps .step")
  const nextButtons = document.querySelectorAll(".next-step")
  const prevButtons = document.querySelectorAll(".prev-step")
  const serviceOptions = document.querySelectorAll(".service-option")

  let currentStep = 1
  let selectedService = ""

  // Service selection
  serviceOptions.forEach((option) => {
    option.addEventListener("click", function () {
      serviceOptions.forEach((opt) => opt.classList.remove("selected"))
      this.classList.add("selected")
      selectedService = this.dataset.service
    })
  })

  // Next step buttons
  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (validateCurrentStep()) {
        if (currentStep < 4) {
          currentStep++
          updateStep()
        }
      }
    })
  })

  // Previous step buttons
  prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep--
        updateStep()
      }
    })
  })

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    if (validateCurrentStep()) {
      submitBooking()
    }
  })

  function updateStep() {
    // Update step indicators
    stepIndicators.forEach((indicator, index) => {
      if (index + 1 <= currentStep) {
        indicator.classList.add("active")
      } else {
        indicator.classList.remove("active")
      }
    })

    // Update form steps
    steps.forEach((step, index) => {
      if (index + 1 === currentStep) {
        step.classList.add("active")
      } else {
        step.classList.remove("active")
      }
    })

    // Update summary if on step 4
    if (currentStep === 4) {
      updateBookingSummary()
    }
  }

  function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`)
    const requiredFields = currentStepElement.querySelectorAll("[required]")
    let isValid = true

    // Special validation for step 1 (service selection)
    if (currentStep === 1 && !selectedService) {
      alert("Please select a service type.")
      return false
    }

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        field.style.borderColor = "#ef4444"
        isValid = false
      } else {
        field.style.borderColor = "#d1d5db"
      }
    })

    if (!isValid) {
      alert("Please fill in all required fields.")
    }

    return isValid
  }

  function updateBookingSummary() {
    // Service details
    document.getElementById("summaryService").textContent =
      selectedService.charAt(0).toUpperCase() + selectedService.slice(1)
    document.getElementById("summaryDescription").textContent = document.getElementById("serviceDescription").value
    document.getElementById("summaryLocation").textContent =
      document.getElementById("location").options[document.getElementById("location").selectedIndex].text +
      ", " +
      document.getElementById("address").value

    // Schedule details
    const date = new Date(document.getElementById("preferredDate").value)
    document.getElementById("summaryDate").textContent = date.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    document.getElementById("summaryTime").textContent = document.getElementById("preferredTime").value
    document.getElementById("summaryUrgency").textContent =
      document.getElementById("urgency").options[document.getElementById("urgency").selectedIndex].text

    // Contact details
    document.getElementById("summaryName").textContent =
      document.getElementById("firstName").value + " " + document.getElementById("lastName").value
    document.getElementById("summaryEmail").textContent = document.getElementById("email").value
    document.getElementById("summaryPhone").textContent = document.getElementById("phone").value
  }

  function submitBooking() {
    // Generate booking reference
    const bookingRef =
      "GF-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 1000)).padStart(3, "0")

    // Update booking reference in modal
    document.getElementById("bookingRef").textContent = bookingRef

    // Show success modal
    document.getElementById("successModal").style.display = "block"

    // Here you would typically send the data to a server
    console.log("Booking submitted:", {
      service: selectedService,
      description: document.getElementById("serviceDescription").value,
      location: document.getElementById("location").value,
      address: document.getElementById("address").value,
      date: document.getElementById("preferredDate").value,
      time: document.getElementById("preferredTime").value,
      urgency: document.getElementById("urgency").value,
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      specialInstructions: document.getElementById("specialInstructions").value,
      bookingReference: bookingRef,
    })
  }
}

// Contact Form Functionality
function initializeContactForm() {
  const form = document.getElementById("contactForm")

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    }

    // Here you would typically send the data to a server
    console.log("Contact form submitted:", formData)

    // Show success message
    alert("Thank you for your message! We'll get back to you within 24 hours.")

    // Reset form
    form.reset()
  })
}

// Modal Functions
function closeModal() {
  document.getElementById("successModal").style.display = "none"

  // Reset booking form
  const form = document.getElementById("bookingForm")
  if (form) {
    form.reset()

    // Reset to first step
    document.querySelectorAll(".form-step").forEach((step, index) => {
      if (index === 0) {
        step.classList.add("active")
      } else {
        step.classList.remove("active")
      }
    })

    document.querySelectorAll(".booking-steps .step").forEach((step, index) => {
      if (index === 0) {
        step.classList.add("active")
      } else {
        step.classList.remove("active")
      }
    })

    // Clear service selection
    document.querySelectorAll(".service-option").forEach((option) => {
      option.classList.remove("selected")
    })
  }
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  const modal = document.getElementById("successModal")
  if (event.target === modal) {
    closeModal()
  }
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Form validation helpers
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validatePhone(phone) {
  const re = /^[0-9]{10}$/
  return re.test(phone.replace(/\s/g, ""))
}

// Add loading states to buttons
function addLoadingState(button) {
  const originalText = button.textContent
  button.textContent = "Loading..."
  button.disabled = true

  setTimeout(() => {
    button.textContent = originalText
    button.disabled = false
  }, 2000)
}

// Console log for debugging
console.log("[v0] FixMate website loaded successfully")
console.log("[v0] All interactive features initialized")
