// BEGIN
/* const app = (laptopsData) => {
    const form = document.querySelector("form");
    const resultBlock = document.querySelector(".result");
    const laptops = laptopsData;

    const formState = {
        processor_eq: '',
        memory_eq: '',
        frequency_gte: '',
        frequency_lte: '',
    };

    const createLaptopCard = (laptop) => {
        return `<section>
            <p>${laptop.model}</p>
            <ul>
                <li>frequency ${laptop.frequency}</li>
                <li>memory ${laptop.memory}</li>
                <li>processor ${laptop.processor}</li>
            </ul>
        </section>`;
    };

    const filterLaptops = () => {
        const { processor_eq, memory_eq, frequency_gte, frequency_lte } = formState;
        
        return laptops.filter(laptop => {
            const processorMatch = !processor_eq || laptop.processor === processor_eq;
            const memoryMatch = !memory_eq || laptop.memory === parseInt(memory_eq, 10);
            const minFrequencyMatch = !frequency_gte || laptop.frequency >= parseFloat(frequency_gte);
            const maxFrequencyMatch = !frequency_lte || laptop.frequency <= parseFloat(frequency_lte);

            return processorMatch && memoryMatch && minFrequencyMatch && maxFrequencyMatch;
        });
    };

    const renderResults = () => {
        resultBlock.innerHTML = '';
        const filteredLaptops = filterLaptops();
        
        filteredLaptops.forEach(laptop => {
            resultBlock.insertAdjacentHTML('beforeend', createLaptopCard(laptop));
        });
    };

    const handleFormUpdate = (event) => {
        const { target } = event;
        if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) return;
        
        formState[target.name] = target.value;
        renderResults();
    };

    form.addEventListener('input', handleFormUpdate);
    form.addEventListener('change', handleFormUpdate);
    renderResults();
};

export default app; */
// END

export default function app(laptops) {
    const form = document.querySelector('form');
    const resultDiv = document.querySelector('.result');

    const DEFAULT_MIN_FREQUENCY = 0;
    const DEFAULT_MAX_FREQUENCY = Infinity;

    const createLaptopElement = laptop => {
        const li = document.createElement('li');
        li.textContent = laptop.model;
        return li;
    };

    const createLaptopList = laptops => {
        const ul = document.createElement('ul');
        laptops.forEach(laptop => ul.appendChild(createLaptopElement(laptop)));
        return ul;
    };

    const renderResults = filteredLaptops => {
        resultDiv.innerHTML = '';
        
        if (filteredLaptops.length === 0) return;
        
        resultDiv.appendChild(createLaptopList(filteredLaptops));
    };

    const getFilterValues = () => {
        const formData = new FormData(form);
        return {
            processor: formData.get('processor_eq'),
            memory: formData.get('memory_eq'),
            frequencyMin: parseFloat(formData.get('frequency_gte')) || DEFAULT_MIN_FREQUENCY,
            frequencyMax: parseFloat(formData.get('frequency_lte')) || DEFAULT_MAX_FREQUENCY,
        };
    };

    const filterLaptops = () => {
        const { processor, memory, frequencyMin, frequencyMax } = getFilterValues();
        
        const filteredLaptops = laptops.filter(laptop => {
            const matchesProcessor = !processor || laptop.processor === processor;
            const matchesMemory = !memory || laptop.memory === parseInt(memory);
            const matchesFrequency = laptop.frequency >= frequencyMin && laptop.frequency <= frequencyMax;
            
            return matchesProcessor && matchesMemory && matchesFrequency;
        });

        renderResults(filteredLaptops);
    };

    const setupEventListeners = () => {
        form.addEventListener('input', filterLaptops);
        form.addEventListener('change', filterLaptops);
    };

    const init = () => {
        renderResults(laptops);
        setupEventListeners();
    };

    init();
}
