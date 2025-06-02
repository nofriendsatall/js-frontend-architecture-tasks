import keyBy from 'lodash/keyBy.js';
import has from 'lodash/has.js';
import isEmpty from 'lodash/isEmpty.js';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';

const routes = {
  usersPath: () => '/users',
};

const schema = yup.object().shape({
  name: yup.string().trim().required(),
  email: yup.string().required('email must be a valid email').email(),
  password: yup.string().required().min(6),
  passwordConfirmation: yup.string()
    .required('password confirmation is a required field')
    .oneOf(
      [yup.ref('password'), null],
      'password confirmation does not match to password',
    ),
});

// Этот объект можно использовать для того, чтобы обрабатывать ошибки сети.
// Это необязательное задание, но крайне рекомендуем попрактиковаться.
const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

// Используйте эту функцию для выполнения валидации.
// Выведите в консоль её результат, чтобы увидеть, как получить сообщения об ошибках.
const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};





// BEGIN

const SELECTORS = {
  FORM: '[data-form="sign-up"]',
  CONTAINER: '[data-container="sign-up"]',
  SUBMIT_BUTTON: 'input[type="submit"]',
};

const PROCESS_STATES = {
  FILLING: 'filling',
  SENDING: 'sending',
  SUBMITTED: 'submitted',
};


const createFeedbackElement = (input, message) => {
  const feedback = document.createElement('div');
  feedback.classList.add('invalid-feedback');
  feedback.textContent = message;
  input.insertAdjacentElement('afterend', feedback);
  return feedback;
};

const updateInputValidityState = (input, error) => {
  const feedback = input.nextElementSibling;
  
  if (error) {
    input.classList.add('is-invalid');
    if (!feedback?.classList.contains('invalid-feedback')) {
      createFeedbackElement(input, error.message);
    } else {
      feedback.textContent = error.message;
    }
  } else {
    input.classList.remove('is-invalid');
    if (feedback?.classList.contains('invalid-feedback')) {
      feedback.remove();
    }
  }
};

const updateSubmitButtonState = (submitButton, isValid) => {
  submitButton.disabled = !isValid;
  submitButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
};


export default () => {
  
  const state = {
    form: {
      valid: false,
      processState: PROCESS_STATES.FILLING,
      fields: {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      },
      errors: {},
    },
  };


  const form = document.querySelector(SELECTORS.FORM);
  const container = document.querySelector(SELECTORS.CONTAINER);
  const submitButton = form.querySelector(SELECTORS.SUBMIT_BUTTON);


  
  const handleStateChange = (path, value) => {
    if (path.startsWith('form.fields')) {
      state.form.errors = validate(state.form.fields);
      state.form.valid = isEmpty(state.form.errors);
      
      updateSubmitButtonState(submitButton, state.form.valid);
      updateFormErrors(form, state.form.errors);
    }

    if (path === 'form.processState' && value === PROCESS_STATES.SUBMITTED) {
      container.innerHTML = 'User Created!';
    }
  };

  const watchedState = onChange(state, handleStateChange);


  const handleInput = (e) => {
    const { name, value } = e.target;
    watchedState.form.fields[name] = value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    watchedState.form.processState = PROCESS_STATES.SENDING;
    updateSubmitButtonState(submitButton, false);

    try {
      await axios.post(routes.usersPath(), watchedState.form.fields);
      watchedState.form.processState = PROCESS_STATES.SUBMITTED;
    } catch (error) {
      watchedState.form.processState = PROCESS_STATES.FILLING;
      showNetworkError(error);
      updateSubmitButtonState(submitButton, state.form.valid);
    }
  };


  const init = () => {
    form.addEventListener('input', handleInput);
    form.addEventListener('submit', handleSubmit);
    updateFormErrors(form, state.form.errors);
  };

  init();
};

const updateFormErrors = (form, errors) => {
  Array.from(form.elements).forEach((element) => {
    if (element.name) {
      updateInputValidityState(element, errors[element.name]);
    }
  });
};

const showNetworkError = (error) => {
  console.error(errorMessages.network.error, error);
};
// END
