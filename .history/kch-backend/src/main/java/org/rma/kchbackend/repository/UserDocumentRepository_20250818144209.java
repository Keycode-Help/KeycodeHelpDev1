package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.UserDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDocumentRepository extends JpaRepository<UserDocument, Long> {
    boolean existsByUserIdAndDocTypeAndVerifiedTrue(Long userId, String docType);
}


