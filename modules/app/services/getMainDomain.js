export default function getMainDomain(domainName = window.location.hostname) {
    const splittedDomain = domainName.split('.');

    if (splittedDomain.length < 2) {
        return domainName;
    }

    return [splittedDomain.pop(), splittedDomain.pop()].reverse().join('.');
}
