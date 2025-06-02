// BEGIN
export default function app(companies) {
    const container = document.querySelector('.container');
    if (!container) return;

    let currentDescription = null;

    const createDescriptionElement = (text) => {
        const description = document.createElement('div');
        description.textContent = text;
        return description;
    };

    const toggleCompanyDescription = (company, button) => {
        const isSameCompany = currentDescription?.textContent === company.description;
        
        if (isSameCompany) {
            currentDescription.remove();
            currentDescription = null;
            return;
        }

        if (currentDescription) {
            currentDescription.remove();
        }

        currentDescription = createDescriptionElement(company.description);
        container.appendChild(currentDescription);
    };

    const createCompanyButton = (company) => {
        const button = document.createElement('button');
        button.className = 'btn btn-primary m-1';
        button.textContent = company.name;
        button.addEventListener('click', () => toggleCompanyDescription(company));
        return button;
    };

    companies.forEach(company => {
        container.appendChild(createCompanyButton(company));
    });
}
// END