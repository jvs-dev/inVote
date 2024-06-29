export function alterToSection(SectionId) {
    let mainSection = document.querySelectorAll(".main__section")
    mainSection.forEach(element => {
        element.style.display = "none"
    });
    SectionId.style.display = "flex"
}

export function shareSection(link) {
    let footer = document.getElementById("footer")
    let shareSectionLink = document.getElementById("shareSectionLink")
    let mainSection = document.querySelectorAll(".main__section")
    mainSection.forEach(element => {
        element.style.display = "none"
    });
    document.getElementById("shareSection").style.display = "flex"
    footer.classList.add("active")
    shareSectionLink.textContent = link
}
