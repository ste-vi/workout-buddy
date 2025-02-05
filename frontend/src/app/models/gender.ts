export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export function getGenderDisplayName(gender?: Gender): string {
  if (!gender) {
    return '';
  }
  return gender
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
