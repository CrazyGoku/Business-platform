export default class NormalizeData {
  constructor({id, unit, value, type, name, rank, permision, target_unit, target_value}) {
    this.id = id;
    this.unit = unit;
    this.value = value;
    this.type = type;
    this.name = name;
    this.rank = rank;
    this.permision = permision;
    this.target_unit = target_unit;
    this.target_value = target_value;
  }
}
