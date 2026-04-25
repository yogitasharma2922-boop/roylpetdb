const bcrypt = require("bcryptjs");

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('owners').del();
  await knex('pets').del();

  const password = await bcrypt.hash("admin123", 10);
  const docPass = await bcrypt.hash("doctor123", 10);
  const recepPass = await bcrypt.hash("recep123", 10);
  const ownerPass = await bcrypt.hash("owner123", 10);

  const [ownerId] = await knex('owners').insert([
    { name: 'Royal Pet Owner', email: 'owner@royalpet.in', mobile: '1234567890', address: '123 Clinic St' }
  ], 'id').then(res => Array.isArray(res) ? res.map(r => r.id || r) : [res]);

  await knex('users').insert([
    { name: 'Admin User', email: 'admin@royalpet.in', password, role: 'admin', avatar: 'AU', active: true },
    { name: 'Doctor Smith', email: 'doctor@royalpet.in', password: docPass, role: 'doctor', avatar: 'DS', active: true },
    { name: 'Receptionist Jane', email: 'reception@royalpet.in', password: recepPass, role: 'receptionist', avatar: 'RJ', active: true },
    { name: 'Pet Owner', email: 'owner@royalpet.in', password: ownerPass, role: 'owner', avatar: 'PO', active: true, ownerId }
  ]);

  await knex('pets').insert([
    { ownerId, name: 'Buddy', type: 'Dog', breed: 'Golden Retriever', gender: 'M', dob: '2022-01-01', weight: '30kg' }
  ]);

  await knex('clinic_settings').insert([
    { key: 'clinic_name', value: 'Royal Pet Clinic' },
    { key: 'currency', value: 'INR' }
  ]);
};
